import sqlite3
from fastapi import FastAPI, Depends, HTTPException,status, Query, Response, File, UploadFile, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer
import schema, models, database, oauth2
from database import engine,SessionLocal,get_db
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from routers import authentication, user
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
from typing import Union
from minio import Minio
from minio.error import S3Error
import minio, uuid, io
import datetime
import base64
from io import BytesIO
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


app = FastAPI()

scheduler = BackgroundScheduler()


# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with the origins that should be allowed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(engine)
app.include_router(authentication.router)
app.include_router(user.router)

minio_client = Minio(
    "127.0.0.1:9000",
    access_key="C4CR3xqY1Kbl4Ci9EbM7",
    secret_key="RnIiddTrNBOrVfbNlHsIckK1rAqmXeU8OR0NgJMb",
    secure=False  # Change to True if using HTTPS
)

class PostCreate(BaseModel):
    email: str
    content: str
    image: str = None


# scheduler = BackgroundScheduler()

# # ...

# # Add the notification cleaner job
# def clean_notifications():
#     ten_seconds_ago = datetime.now() - timedelta(seconds=10)
#     query = "DELETE FROM notifications WHERE created_at <= ?"
#     c = app.state.conn.cursor()
#     c.execute(query, (ten_seconds_ago,))
#     app.state.conn.commit()

# # Schedule the notification cleaner job to run every 10 seconds
# scheduler.add_job(clean_notifications, 'interval', seconds=10)
# scheduler.start()


@app.on_event("startup")
async def startup():
    # Connect to the SQLite database
    app.state.conn = sqlite3.connect('linkedin.db')
    app.state.conn.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            content TEXT,
            image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    app.state.conn.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            notification TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')


@app.on_event("shutdown")
async def shutdown():
    # Close the database connection on shutdown
    app.state.conn.close()

@app.post("/posts/", status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreate):
    if post.image:
        try:
            image_data = base64.b64decode(post.image.split(",")[1])

            # Upload the image to MinIO
            image_name = f"{post.email}_{str(uuid.uuid4())}.jpg"  # Generate a unique image name

            minio_client.put_object("linkedin", image_name, BytesIO(image_data), len(image_data))
            print("cholse")
            # Get the URL of the uploaded image
            image_url = f"https://127.0.0.1:39841/linkedin/{image_name}"
            values = (post.email, post.content, image_url)
        except Exception as e:
            print(f"An error occurred: {e}")    

    query = '''
        INSERT INTO posts (email, content, image)
        VALUES (?, ?, ?)
    '''
    values = (post.email, post.content, post.image)  # Initialize with an empty URL

    c = app.state.conn.cursor()
    c.execute(query, values)
    app.state.conn.commit()

    notification = f"{post.email} posted a new post"
    c.execute("INSERT INTO notifications (notification) VALUES (?)", (notification,))
    app.state.conn.commit()

    return {"message": "Post created successfully"}


@app.get("/posts/")
async def get_posts():
    query = "SELECT email, content, image, created_at FROM posts ORDER BY created_at DESC"  # Order by creation timestamp in descending order
    c = app.state.conn.cursor()
    c.execute(query)
    rows = c.fetchall()
    posts = [{"email": row[0], "content": row[1], "image": row[2], "created_at": row[3]} for row in rows]
    return {"posts": posts}

@app.get("/notifications/")
async def get_notifications():
    query = "SELECT notification, created_at FROM notifications"
    c = app.state.conn.cursor()
    c.execute(query)
    rows = c.fetchall()
    notifications = [{"notification": row[0], "created_at": row[1]} for row in rows]
    return {"notifications": notifications}


@app.get("/posts/{post_id}")
async def get_post(post_id: int):
    query = "SELECT email, content, image FROM posts WHERE id = ?"
    c = app.state.conn.cursor()
    c.execute(query, (post_id,))
    row = c.fetchone()

    if row:
        email, content, image = row
        post = {"email": email, "content": content, "image": image}
        return {"post": post}
    else:
        return {"error": "Post not found"}
    

