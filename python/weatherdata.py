from selenium import webdriver
from bs4 import BeautifulSoup
import time
from datetime import date
from datetime import datetime
import pymysql
import pyowm
import json


def get_data(url): 
    driver = webdriver.PhantomJS()
    now = date.today()
    currentdate = now.strftime('%d.%m.%Y')
    datefordb = now.strftime('%d-%m-%Y')
    #print(currentdate)
    hour = datetime.now()
    currenthour = hour.strftime('%H:%M:%S')
    #print(currenthour)
    hourfortable = int(hour.strftime('%H'))
    #print(hourfortable)
    owm = pyowm.OWM('491ec1776c4d34c34595422ec2aa482c')

    if (url == "aleje"):
        now = owm.weather_at_coords(50.057678, 19.926189)
        weather = now.get_weather()
        temperature = weather.get_temperature('celsius')
        wind = weather.get_wind()
        hum = weather.get_humidity()
        temp = temperature['temp'] 
        wind = wind['speed']
        wind = str(wind)
        hum = str(hum)
        temp = str(temp)
        with open("aleje.txt", "a") as file:
            file.write(hum + ', ' + temp + ', ' + wind )

    elif (url == "zlotyrog"):
        now = owm.weather_at_coords(50.081197, 19.895358)
        weather = now.get_weather()
        temperature = weather.get_temperature('celsius')
        wind = weather.get_wind()
        hum = weather.get_humidity()
        temp = temperature['temp'] 
        wind = wind['speed']
        wind = str(wind)
        hum = str(hum)
        temp = str(temp)
        with open("zlotyrog.txt", "a") as file:
            file.write(hum + ', ' + temp + ', ' + wind )

    elif (url == "piastow"):
        now = owm.weather_at_coords(50.099361, 20.018317)
        weather = now.get_weather()
        temperature = weather.get_temperature('celsius')
        wind = weather.get_wind()
        hum = weather.get_humidity()
        temp = temperature['temp'] 
        wind = wind['speed']
        wind = str(wind)
        hum = str(hum)
        temp = str(temp)
        with open("piastow.txt", "a") as file:
            file.write(hum + ', ' + temp + ', ' + wind )

    elif (url == "kurdwanow"):
        now = owm.weather_at_coords(50.010575, 19.949189)
        weather = now.get_weather()
        temperature = weather.get_temperature('celsius')
        wind = weather.get_wind()
        hum = weather.get_humidity()
        temp = temperature['temp'] 
        wind = wind['speed']
        wind = str(wind)
        hum = str(hum)
        temp = str(temp)
        with open("kurdwanow.txt", "a") as file:
            file.write(hum + ', ' + temp + ', ' + wind )

    elif (url == "dietla"):
        now = owm.weather_at_coords(50.057678, 19.926189)
        weather = now.get_weather()
        temperature = weather.get_temperature('celsius')
        wind = weather.get_wind()
        hum = weather.get_humidity()
        temp = temperature['temp'] 
        wind = wind['speed']
        wind = str(wind)
        hum = str(hum)
        temp = str(temp)
        with open("dietla.txt", "a") as file:
            file.write(hum + ', ' + temp + ', ' + wind )

    elif (url == "nowahuta"):
        now = owm.weather_at_coords(50.069308,  20.053492)
        weather = now.get_weather()
        temperature = weather.get_temperature('celsius')
        wind = weather.get_wind()
        hum = weather.get_humidity()
        temp = temperature['temp'] 
        wind = wind['speed']
        wind = str(wind)
        hum = str(hum)
        temp = str(temp)
        with open("nowahuta.txt", "a") as file:
            file.write(hum + ', ' + temp + ', ' + wind )


def insert(name):
    conn = pymysql.connect(user='myuser',passwd='mypass',db='mydb', host='localhost', local_infile =True)
    cur = conn.cursor()
    cur.execute("""LOAD DATA LOCAL INFILE '/var/www/html/python/"""+ name + """.txt' INTO TABLE data FIELDS TERMINATED BY ',' (sensor_id, date, hour, pm10, pm25, humidity, temperature, wind) SET ID = NULL; """)
    cur.execute("""SELECT * FROM geo;""")
    for result in cur:
	    print(result)
    conn.commit()
    cur.close()
    conn.close()


get_data(url = "aleje")
get_data(url = "dietla")
get_data(url = "zlotyrog")
get_data(url = "nowahuta")
get_data(url = "kurdwanow")
get_data(url = "piastow")

#insert(name = "dietla")
#insert(name = "aleje")
#insert(name = "zlotyrog")
#insert(name = "nowahuta")
#insert(name = "kurdwanow")
#insert(name = "piastow")


