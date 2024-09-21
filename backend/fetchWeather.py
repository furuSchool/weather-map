import json
import requests


def getResponse(url):
    with requests.get(url) as response:
        data = response.json()
    return data


def fetchWeather():
    with open('./backend/area.json', 'r', encoding='utf-8') as file:
        area = json.load(file)
    pref_code = [k for k, v in area["offices"].items()
                 if v["name"] == "大東島地方"][0]
    # weekForecastUrl = f"https://www.jma.go.jp/bosai/forecast/data/forecast/{pref_code}.json"
    hoursForecastUrl = f"https://www.jma.go.jp/bosai/jmatile/data/wdist/VPFD/{pref_code}.json"

    forecast = getResponse(hoursForecastUrl)
    print(forecast)
    # forecast = getResponse(weekForecastUrl)
    # print(forecast)

fetchWeather()
