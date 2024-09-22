import { useRef, useState, useCallback, useEffect } from "react";
import ReactDOMServer from "react-dom/server";

const MAP_OPTIONS = {
  center: { lat: 35.7121603851677, lng: 139.76202070318402 },
  zoom: 10,
  mapId: "DEMO_MAP_ID", // TODO: 本番環境で適切な値に変更
};

type Wind = {
  direction: string;
  speed: number;
  range: string;
};

type WeatherForecast = {
  [key: string]: {
    weather: string;
    wind: Wind;
    temperature: number;
  };
};

type WeatherInfo = {
  date: string;
  condition: string;
  temperature: number;
  windSpeed: number;
  windDirection: string;
};

type ForecastData = {
  spot: string;
  forecast: Array<WeatherForecast>;
};

interface DirectionArrowProps {
  direction: string;
  windSpeed: number; // 風速
}

function formatJapaneseDate(dateStr: string): string {
  const date = new Date(dateStr);

  // 曜日を取得するための配列
  const daysOfWeek: string[] = ["日", "月", "火", "水", "木", "金", "土"];

  // 日付の各要素を取得
  const month: number = date.getMonth() + 1; // 月は0から始まるため+1
  const day: number = date.getDate();
  const dayOfWeek: string = daysOfWeek[date.getDay()]; // 曜日を取得
  const hours: number = date.getHours();

  // フォーマットを組み立て
  return `${month}/${day}（${dayOfWeek}） ${hours}時`;
}

const DirectionArrow: React.FC<DirectionArrowProps> = ({
  direction,
  windSpeed,
}) => {
  const arrows: Record<string, string> = {
    北: "↓",
    北東: "↙",
    東: "←",
    南東: "↖",
    南: "↑",
    南西: "↗",
    西: "→",
    北西: "↘",
  };

  const arrow = arrows[direction];

  // 風速に応じた色を決定
  let arrowColor;
  if (windSpeed < 5) {
    arrowColor = "gray";
  } else if (windSpeed < 10) {
    arrowColor = "blue";
  } else if (windSpeed < 15) {
    arrowColor = "yellow";
  } else {
    arrowColor = "red";
  }

  return (
    <>
      <div>
        <b style={{ color: arrowColor, fontSize: 30 }}>{arrow} </b>
      </div>
      <div style={{ fontSize: 15 }}>{direction}</div>
      <div>{windSpeed} m/s</div>
    </>
  );
};

// 天気情報の個々のコンポーネント
const WeatherCard: React.FC<WeatherInfo> = ({
  date,
  condition,
  temperature,
  windSpeed,
  windDirection,
}) => {
  return (
    <td
      style={{
        border: "1px solid black",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <b
        style={{
          fontSize: "18px",
          borderBottom: "1px solid black",
          paddingBottom: "7px",
        }}
      >
        {formatJapaneseDate(date)}
      </b>
      <div style={{ fontSize: "40px", padding: "10px" }}>{condition}</div>
      {condition == "晴れ" ? (
        <img src="/src/assets/Icons/100.png" alt="Icon" />
      ) : condition == "くもり" ? (
        <img src="/src/assets/Icons/200.png" alt="Icon" />
      ) : condition == "雨" ? (
        <img src="/src/assets/Icons/300.png" alt="Icon" />
      ) : (
        <img src="/src/assets/Icons/noimage.png" alt="Icon" />
      )}
      <div
        style={{
          display: "flex",
          paddingTop: "3px",
          borderTop: "1px solid black",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "50%",
            borderRight: "1px solid black",
            paddingRight: "10px",
            fontSize: "20px",
            display: "flex",
          }}
        >
          <p>{temperature} °C</p>
        </div>

        <div style={{ width: "50%", paddingLeft: "10px", fontSize: "20px" }}>
          <DirectionArrow direction={windDirection} windSpeed={windSpeed} />
        </div>
      </div>
    </td>
  );
};

function RenderForecast(props: { forecast: ForecastData }) {
  const forecast = props.forecast.forecast;

  return (
    <>
      <h1>{props.forecast.spot}の天気</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            {forecast.map((data, index) => (
              <WeatherCard
                key={index}
                date={Object.keys(data)[0]}
                condition={data[Object.keys(data)[0]]["weather"]}
                temperature={data[Object.keys(data)[0]]["temperature"]}
                windSpeed={data[Object.keys(data)[0]]["wind"]["speed"]}
                windDirection={data[Object.keys(data)[0]]["wind"]["direction"]}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default function GMapContent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [infoWindow] = useState<google.maps.InfoWindow>(
    new window.google.maps.InfoWindow()
  );

  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      marker?.setMap(null);

      const latLng = e.latLng;
      const newMarker = new window.google.maps.Marker({
        position: latLng,
        map,
      });
      setMarker(newMarker);

      const response = await fetch(
        `http://localhost:8000?lat=${latLng?.lat()}&lon=${latLng?.lng()}`
      );
      const forecast = await response.json();
      console.log(forecast);

      infoWindow.setContent(
        ReactDOMServer.renderToStaticMarkup(
          <RenderForecast forecast={forecast} />
        )
      );
      infoWindow.open(map, newMarker);

      infoWindow.addListener("close", () => {
        newMarker.setMap(null);
        setMarker(null);
      });
    },
    [map, marker, infoWindow]
  );

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, MAP_OPTIONS);
      setMap(newMap);
    }
  }, [mapRef, map]);

  useEffect(() => {
    if (map) {
      map.addListener("click", handleMapClick);
    }
  }, [map, handleMapClick]);

  return <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />;
}
