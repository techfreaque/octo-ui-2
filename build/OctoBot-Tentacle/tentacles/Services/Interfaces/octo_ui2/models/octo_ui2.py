import os


CORS_ENABLED = os.getenv("CORS_MODE_ENABLED") or False
DEV_MODE_ENABLED = os.getenv("API_DEV_MODE_ENABLED") or False


def dev_mode_is_on():
    return DEV_MODE_ENABLED


def import_cross_origin_if_enabled():
    if CORS_ENABLED:
        from flask_cors import cross_origin

        return cross_origin
