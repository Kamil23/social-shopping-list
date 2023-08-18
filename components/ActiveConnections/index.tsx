const ActiveConnections = ({ numberOfConnections }: { numberOfConnections: number }) => {
  const connectionElements = [];

  for (let i = 0; i < numberOfConnections; i++) {
    connectionElements.push(
      <div key={i} className="w-1 h-1 bg-green-400 rounded-full"></div>
    );
  }

  return <>{connectionElements}</>;
};
 
export default ActiveConnections;