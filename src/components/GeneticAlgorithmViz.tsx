import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const data = [
  { generation: "Gen 1", fitness: 65, diversity: 85 },
  { generation: "Gen 50", fitness: 72, diversity: 75 },
  { generation: "Gen 100", fitness: 81, diversity: 68 },
  { generation: "Gen 200", fitness: 88, diversity: 55 },
  { generation: "Gen 500", fitness: 93, diversity: 42 },
  { generation: "Gen 1000", fitness: 96, diversity: 35 },
];

export const GeneticAlgorithmViz = () => {
  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle>Genetic Algorithm Evolution</CardTitle>
        <CardDescription>Fitness progression and population diversity over generations</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="generation" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Legend />
            <Bar 
              dataKey="fitness" 
              fill="hsl(var(--chart-1))" 
              name="Fitness Score"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="diversity" 
              fill="hsl(var(--chart-2))" 
              name="Population Diversity"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
