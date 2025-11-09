import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const data = [
  { month: "Jan", predicted: 45, actual: 42, optimized: 48 },
  { month: "Feb", predicted: 52, actual: 50, optimized: 56 },
  { month: "Mar", predicted: 61, actual: 59, optimized: 65 },
  { month: "Apr", predicted: 70, actual: 68, optimized: 75 },
  { month: "May", predicted: 78, actual: 75, optimized: 82 },
  { month: "Jun", predicted: 85, actual: 82, optimized: 89 },
];

export const PredictionChart = () => {
  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle>Yield Prediction Analysis</CardTitle>
        <CardDescription>AI predictions vs actual yield with genetic optimization</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              name="AI Predicted"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              name="Actual Yield"
            />
            <Line 
              type="monotone" 
              dataKey="optimized" 
              stroke="hsl(var(--chart-3))" 
              strokeWidth={2}
              name="GA Optimized"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
