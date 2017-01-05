#!/usr/bin/python3
from selenium import webdriver
from bs4 import BeautifulSoup
import time
from datetime import date
from datetime import datetime

def get_data(url):
    driver = webdriver.PhantomJS()
    now = date.today()
    currentdate = now.strftime('%d.%m.%Y')
    datefordb = now.strftime('%Y-%m-%d')
    print(currentdate)
    hour = datetime.now()
    currenthour = hour.strftime('%H:%M:%S')
    print(currenthour)
    hourfortable = int(hour.strftime('%H'))
    print(hourfortable)

    if (url == "aleje"):
        driver.get("http://monitoring.krakow.pios.gov.pl/dane-pomiarowe/automatyczne/stacja/6/parametry/46-202/dzienny/%s" %currentdate)
        html = driver.execute_script("return document.documentElement.innerHTML;").encode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.body
        table1 = table.find_all('tbody')[3]
        tablehour = table1.find_all('td')[(hourfortable*3)-3].text
        pm10 = table1.find_all('td')[(hourfortable*3)-2].text
        pm2 = table1.find_all('td')[(hourfortable*3)-1].text
        type = 'public'
        #print(table1.encode('utf-8'))
        print(pm10.encode('utf-8'))
        print(pm2.encode('utf-8'))
        with open("aleje.txt", "w") as file:
            file.write('1' + ', ' + datefordb + ', ' + currenthour + ', ' + pm10 + ', ' + pm2 + ', ')

    elif (url == "zlotyrog"):
        driver.get("http://monitoring.krakow.pios.gov.pl/dane-pomiarowe/automatyczne/stacja/153/parametry/1752/dzienny/%s" %currentdate)
        html = driver.execute_script("return document.documentElement.innerHTML;").encode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.body
        table1 = table.find_all('tbody' )[2]
        tablehour = table1.find_all('td')[(hourfortable*2)-2].text
        pm10 = table1.find_all('td')[(hourfortable*2)-1].text
        print(tablehour.encode('utf-8')) 
        #print(table1.encode('utf-8'))
        print(pm10.encode('utf-8'))
        type = 'public'
        with open("zlotyrog.txt", "w") as file:
            file.write('2' + ', ' + datefordb + ', ' + currenthour + ', ' + pm10 + ', ' + '-' + ', ')

    elif (url == "piastow"):
        driver.get("http://monitoring.krakow.pios.gov.pl/dane-pomiarowe/automatyczne/stacja/152/parametry/1747/dzienny/%s" %currentdate)
        html = driver.execute_script("return document.documentElement.innerHTML;").encode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.body
        table1 = table.find_all('tbody' )[2]
        tablehour = table1.find_all('td')[(hourfortable*2)-2].text
        pm10 = table1.find_all('td')[(hourfortable*2)-1].text
        print(tablehour.encode('utf-8')) 
        #print(table1.encode('utf-8'))
        print(pm10.encode('utf-8'))
        type = 'public'
        with open("piastow.txt", "w") as file:
            file.write('3' + ', ' + datefordb + ', ' + currenthour + ', ' + pm10 + ', ' + '-' + ', ')

    elif (url == "kurdwanow"):
        driver.get("http://monitoring.krakow.pios.gov.pl/dane-pomiarowe/automatyczne/stacja/16/parametry/148-242/dzienny/%s" %currentdate)
        html = driver.execute_script("return document.documentElement.innerHTML;").encode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.body
        table1 = table.find_all('tbody')[3]
        tablehour = table1.find_all('td')[(hourfortable*3)-3].text
        pm10 = table1.find_all('td')[(hourfortable*3)-2].text
        pm2 = table1.find_all('td')[(hourfortable*3)-1].text
        print(tablehour.encode('utf-8')) 
        #print(table1.encode('utf-8'))
        print(pm10.encode('utf-8'))
        type = 'public'
        with open("kurdwanow.txt", "w") as file:
            file.write('4' + ', ' + datefordb + ', ' + currenthour + ', ' + pm10 + ', ' + pm2 + ', ')

    elif (url == "dietla"):
        driver.get("http://monitoring.krakow.pios.gov.pl/dane-pomiarowe/automatyczne/stacja/149/parametry/1723/dzienny/%s" %currentdate)
        html = driver.execute_script("return document.documentElement.innerHTML;").encode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.body
        table1 = table.find_all('tbody' )[2]
        tablehour = table1.find_all('td')[((hourfortable-1)*2)-2].text
        pm10 = table1.find_all('td')[((hourfortable-1)*2)-1].text
        print(tablehour.encode('utf-8')) 
        #print(table1.encode('utf-8'))
        print(pm10.encode('utf-8'))
        type = 'public'
        with open("dietla.txt", "w") as file:
            file.write('5' + ', ' + datefordb + ', ' + currenthour + ', ' + pm10 + ', ' + ' ' + ', ')

    elif (url == "nowahuta"):
        driver.get("http://monitoring.krakow.pios.gov.pl/dane-pomiarowe/automatyczne/stacja/7/parametry/57-211/dzienny/%s" %currentdate)
        html = driver.execute_script("return document.documentElement.innerHTML;").encode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.body
        databody = table.find_all('tbody' )[3]
        tablehour = databody.find_all('td')[(hourfortable*3)-3].text
        pm10 = databody.find_all('td')[(hourfortable*3)-2].text
        pm2 = databody.find_all('td')[(hourfortable*3)-1].text
        print(tablehour.encode('utf-8')) 
        #print(databody.encode('utf-8'))
        print(pm10.encode('utf-8'))
        print(pm2.encode('utf-8'))
        type = 'public'
        with open("nowahuta.txt", "w") as file:
            file.write('6' + ', ' + datefordb + ', ' + currenthour + ', ' + pm10 + ', ' + pm2 + ', ')

    return;
get_data(url = "dietla")
get_data(url = "aleje")
get_data(url = "zlotyrog")
get_data(url = "nowahuta")
get_data(url = "kurdwanow")
get_data(url = "piastow")




