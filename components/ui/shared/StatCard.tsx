
const StatCard = ({ title, value }:{title:any,value:any}) => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
  
  export default StatCard;