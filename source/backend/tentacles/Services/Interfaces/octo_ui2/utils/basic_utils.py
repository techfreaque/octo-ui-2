
def get_response(success=True, data=None, message=None):
    respones = {"success": success}
    if data:
        respones["data"] = data
    if message:
        respones["message"] = message
    return respones
