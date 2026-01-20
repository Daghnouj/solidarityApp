
import Card from "../ui/Card";

const TherapyProgressWidget = () => (
  <Card>
    <h3 className="text-sm text-gray-600 font-medium mb-2">Therapy Progress</h3>
    <div className="w-full bg-gray-200 h-3 rounded-full">
      <div className="bg-teal-500 h-3 rounded-full" style={{ width: "65%" }}></div>
    </div>
    <p className="text-xs text-gray-500 mt-2">65% goals achieved this month</p>
  </Card>
);

export default TherapyProgressWidget;
