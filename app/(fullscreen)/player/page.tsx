import AudioLayout from "./AudioLayout";
import TrackRow from "./track-row";

export default function Page(){
  return(
    // inside page.tsx or layout.tsx
<AudioLayout>
  <TrackRow 
    index={1} 
    title="Kenji's Theme" 
    artist="Joe Hisaishi" 
    album="Hana-Bi OST"
    duration="03:45"
    bitrate="320kbps"
    format="MP3"
    source="LOCAL" // This triggers the Green "Hard Drive" icon
    isPlaying={true} // This triggers the bounce animation
  />
  <TrackRow 
    index={2} 
    title="Instant Crush" 
    artist="Daft Punk" 
    album="RAM"
    duration="05:12"
    bitrate="1411kbps"
    format="FLAC"
    source="CLOUD" // This triggers the Blue "Cloud" icon
  />
</AudioLayout>
  )
}