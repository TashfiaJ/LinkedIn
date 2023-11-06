def postSchema(post)-> dict:
    return {
        "id": str(post["_id"]),
        "username": post["username"],
        "texts":post["texts"],
        "image_url": post["image_url"],
    }

def postsSchema(posts)->list:
    return [postSchema(post) for post in posts]

