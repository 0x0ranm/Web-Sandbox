"""
This client handles the communication protocol with the docker.
It queries new request for scanning websites and parse the results. 
"""
import requests
import json
import hashlib
import os
import re
import socket
import argparse
from urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(category=InsecureRequestWarning)

AUTH_HEADER = "<modify>"
AUTH_VALUE = "<modify>"

headers = {AUTH_HEADER: AUTH_VALUE}
SANDBOX_PORT = 8888
REMOTE_ENDPOINT_URL = "https://{}:{}/url?url={}"

def scan_site(url, sandbox_server):
    """
    The function gets a URL to scan and the sandbox server IP and sends a request to the URL sandbox. 
    The function returns JSON with the following infromation - 
    1. The scanned URL
    2. The content of the page
    3. The location of the screenshot taken from the page
    """
    server_url = REMOTE_ENDPOINT_URL.format(sandbox_server, SANDBOX_PORT, url)

    # Request remote headless chrome
    res = requests.get(server_url, headers=headers, verify = False)
    response = json.loads(res.text)
    if "Error" in response.keys():
        if response["Error"] == "Unauthorized":
            print("[*] Make sure you configure correctly the auth-header and auth-header-value parameters.")
            return {}
        else:
            print("Error: " + response["Error"])
            return {}
    else:
        img_buffer = json.loads(res.text)["image"]["data"]
        site_content = json.loads(res.text)["content"]

        # Save img
        img_location = save_image(url, img_buffer)
        html_parser_data = parse_site_result(site_content)

        return {
            "URL": url,
            "Data": site_content.encode("utf-8"),
            "Image:" img_location
        }

def save_image(url, img_content):
    """
    The function saves a screenshot of the scanned site.
    """
    img_bytes = bytearray(img_content)
    hashed_url = hashlib.sha256(url.encode('utf-8')).hexdigest()

    # Save file 
    img_location = os.path.join("Images", hashed_url + ".png")
    with open(img_location, "wb") as file_obj:
        file_obj.write(img_bytes)
    return img_location

def run():
    arg_parse = argparse.ArgumentParser()
	arg_parse.add_argument("-u", "--url", help="URL to scan")
	arg_parse.add_argument("-s", "--server", help="Sandbox server IP")
	args = arg_parse.parse_args()
    print(scan_site(args.url, args.server))

main()