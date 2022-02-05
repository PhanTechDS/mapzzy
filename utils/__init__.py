import re

email = re.compile(r'([a-zA-Z0-9\.\!]*)+\@+([a-zA-Z\.]*)+\.+([A-Za-z]{2,})')

phone = re.compile(r'[0-9]{10}')
