from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import cleanup_notifications, router
from apscheduler.schedulers.background import BackgroundScheduler

app=FastAPI()

origins = [
    "http://localhost",
    "https://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
