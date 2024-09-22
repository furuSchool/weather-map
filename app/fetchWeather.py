import json
import requests


def getResponse(url):
    with requests.get(url) as response:
        data = response.json()
    return data


def searchClass10sCode(lat, lon):
    # 緯度・経度から自治体コードをゲット
    with requests.get(
            f"https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat={lat}&lon={lon}"
    ) as response:
        data = response.json()
    jichitaiCode = data["results"]["muniCd"] + "00"

    # 自治体コードから一次細分区域のコードをゲット
    with open('app/area.json', 'r', encoding='utf-8') as file:
        area = json.load(file)
    class15sCode = area["class20s"][jichitaiCode]["parent"]
    class10sCode = area["class15s"][class15sCode]["parent"]
    return class10sCode


def searchOfficesCode(lat, lon):
    # 緯度・経度から自治体コードをゲット
    with requests.get(
            f"https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat={lat}&lon={lon}"
    ) as response:
        data = response.json()
    jichitaiCode = data["results"]["muniCd"] + "00"

    # 自治体コードから一次細分区域のコードをゲット
    with open('app/area.json', 'r', encoding='utf-8') as file:
        area = json.load(file)
    class15sCode = area["class20s"][jichitaiCode]["parent"]
    class10sCode = area["class15s"][class15sCode]["parent"]
    officesCode = area["class10s"][class10sCode]["parent"]
    return officesCode


# 緯度・経度から3日間の予報をゲットする関数
def fetchThreeDaysForecast(lat, lon):
    class10sCode = searchClass10sCode(lat, lon)
    # pref_code = [k for k, v in area["offices"].items() if v["name"] == "大東島地方"][0]

    threeDaysForecastUrl = f"https://www.jma.go.jp/bosai/jmatile/data/wdist/VPFD/{class10sCode}.json"

    forecast = getResponse(threeDaysForecastUrl)

    spot = forecast["pointTimeSeries"]["pointNameJP"]
    baseTime = [
        item["dateTime"] for item in forecast["areaTimeSeries"]["timeDefines"]
    ]
    timeBasedWeather = [item for item in forecast["areaTimeSeries"]["weather"]]
    timeBasedWind = [item for item in forecast["areaTimeSeries"]["wind"]]
    timeBasedTemperature = [
        item for item in forecast["pointTimeSeries"]["temperature"]
    ]

    return {
        "spot":
        spot,
        "forecast": [{
            item: {
                "weather": timeBasedWeather[index],
                "wind": timeBasedWind[index],
                "temperature": timeBasedTemperature[index]
            }
        } for index, item in enumerate(baseTime)]
    }


# 緯度・経度から週間予報をゲットする関数
def fetchWeekForecast(lat, lon):
    officeCode = searchOfficesCode(lat, lon)
    weekForecastUrl = f"https://www.jma.go.jp/bosai/forecast/data/forecast/{officeCode}.json"

    forecast = getResponse(weekForecastUrl)
    return forecast


print(fetchThreeDaysForecast(35.678512, 139.774347))
# print(fetchWeekForecast(35.678512, 139.774347))
