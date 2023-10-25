from fastapi import APIRouter, HTTPException, UploadFile, Form, File
from datetime import datetime, timezone
from minio import Minio
import io
import uuid
from config import user_collection, db
from model import POSTS
from schema import postSchema, postsSchema
from bson import ObjectId
import json
import asyncio

router = APIRouter()

# RabbitMQ configuration has been removed
# ...

@router.on_event('startup')
async def startup():
    await asyncio.sleep(30)
    # RabbitMQ connection code has been removed
    pass

@router.get("/post", response_model=list[POSTS])
def get_posts():
    try:
        posts = user_collection.find()
        post_list = postsSchema(posts)
        return post_list
    except Exception as error:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get('/post/{postId}', response_model=POSTS)
async def get_post(postId: str):
    try:
        post = user_collection.find_one({"_id": ObjectId(postId)})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return postSchema(post)
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/post")
async def add_post(username: str = Form(None),
                   texts: str = Form(None),
                   image_file: UploadFile = File(None)):
    try:
        image_url = ""
        if image_file:
            image_url = await upload_image(image_file, username)
        result = user_collection.insert_one({
            "username": username,
            "texts": texts,
            "image_url": image_url
        })
        post_id = result.inserted_id

        # Create notification message (excluding RabbitMQ related code)
        message = "Added an image!"
        if texts:
            message = texts[:70]

        # Connection and channel creation for RabbitMQ have been removed

    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Internal server error")

# Define your proxy configuration (assuming this is needed for Minio)
proxy_host = 'minio'
proxy_port = 9000

# Create an HTTP client session with proxy settings
from urllib3 import make_headers
from urllib3 import ProxyManager

proxy_headers = make_headers(proxy_basic_auth='username:password')  # If your proxy requires authentication
http_client = ProxyManager(
    proxy_url=f"http://{proxy_host}:{proxy_port}",
    proxy_headers=proxy_headers
)

# Create a Minio client with the configured HTTP client
minio_client = Minio(
    "127.0.0.1:9000",
    access_key="C4CR3xqY1Kbl4Ci9EbM7",
    secret_key="RnIiddTrNBOrVfbNlHsIckK1rAqmXeU8OR0NgJMb",
    secure=False  # Change to True if using HTTPS
)

async def upload_image(imgFile, username: str):
    bucket_name = "linkedin"
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)
    file_bytes = await imgFile.read()
    unique_filename = username + str(uuid.uuid4()) + "_" + imgFile.filename
    file_stream = io.BytesIO(file_bytes)

    minio_client.put_object(
        "linkedin",
        unique_filename,
        file_stream,
        length=len(file_bytes),
        content_type=imgFile.content_type,
    )

    presigned_url = minio_client.presigned_get_object('linkedin', unique_filename)
    print(presigned_url)
    return presigned_url
