import { Status, Wrapper } from "@googlemaps/react-wrapper";
import GMapContent from "./GMapContent";

// TODO: referer 制限をかける
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function render(status: Status) {
  switch (status) {
    case Status.LOADING:
      return <div>Loading...</div>;
    case Status.FAILURE:
      return <div>Failed to load Google Maps</div>;
    case Status.SUCCESS:
      return <GMapContent />;
  }
}

export default function GMap() {
  return <Wrapper apiKey={API_KEY} render={render} />;
}
