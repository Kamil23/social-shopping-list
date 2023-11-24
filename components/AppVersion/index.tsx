import packageJson from "../../package.json";

export default function AppVersion() {
  const appVersion = packageJson.version;
  return (
    <p className="text-xs text-gray-400">{`Wersja: ${appVersion}-beta`}</p>
  )
}