import time
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from config import user_collection, db
from schema import notificationsEntity
from apscheduler.schedulers.background import BackgroundScheduler
from model import Notification
import aio_pika
import json
import asyncio

router = APIRouter()

@router.post("/create_notification")
def create_notification(notification: Notification):
    print(notification)
    try:
        result = user_collection.insert_one(notification.dict())

        if result.acknowledged:
            return {"message": "Notification created successfully"}
        else:
            return {"message": "Failed to create notification"}
    except Exception as error:
        print(error)
        return {"message": "Failed to create notification"}

@router.get("/get_notification", response_model=list[str])
def get_notifications(user_id: str):
    print(user_id)
    try:
        filtered_notifications = user_collection.find({"username": {"$ne": user_id}})
        notification_list = list(filtered_notifications)

        current_timestamp = int(time.time())  # Get the current timestamp in seconds
        formatted_messages = []

        for notification in notification_list:
            timestamp = notification["timeStamp"]
            timestamp_seconds = int(timestamp.timestamp())  # Convert the timestamp to seconds
            time_elapsed = current_timestamp - timestamp_seconds
            minutes_elapsed = time_elapsed // 60
            formatted_message = f"{notification['username']} has posted {minutes_elapsed} minutes ago"
            formatted_messages.append(formatted_message)

        return formatted_messages
    except Exception as error:
        raise HTTPException(status_code=500, detail="Internal server error")

def delete_old_notifications():
    # Get all notifications from the collection
    all_notifications = user_collection.find()
    current_timestamp = int(time.time())  # Get the current timestamp in seconds
    deleted_count = 0

    for notification in all_notifications:
        timestamp = notification["timeStamp"]
        timestamp_seconds = int(timestamp.timestamp())  # Convert the timestamp to seconds
        time_elapsed = current_timestamp - timestamp_seconds
        minutes_elapsed = time_elapsed // 60
        print("noti", current_timestamp)
        print("ts", timestamp_seconds)
        if minutes_elapsed >= 30:
            # Delete the notification if it's older than 30 minutes
            # user_collection.delete_one({"_id": notification["_id"]})
            deleted_count += 1

    print(f"Deleted {deleted_count} notifications older than 30 minutes")

@router.get("/cleanup_notifications")
def cleanup_notifications():
    # Schedule the cleanup task to run in the background
    delete_old_notifications()
    return {"message": "Cleanup task scheduled"}

scheduler = BackgroundScheduler()
scheduler.add_job(cleanup_notifications, 'interval', minutes=0.1)
scheduler.start()
