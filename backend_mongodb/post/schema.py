def postSchema(post)-> dict:
    return {
        "id": str(post["_id"]),
        "username": post["username"],
        "image_url": post["image_url"],
        "texts":post["texts"]
    }

def postsSchema(posts)->list:
    return [postSchema(post) for post in posts]