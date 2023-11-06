def notificationEntity(item)-> dict:
    return {
        "username": item["username"],
        "timestamp": item["timestamp"]
    }

def notificationsEntity(entity)->list:
    return [notificationEntity(item) for item in entity]