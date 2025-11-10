import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PredictionChart } from "@/components/PredictionChart";
import { GeneticAlgorithmViz } from "@/components/GeneticAlgorithmViz";
import { Sprout, Brain, Dna, TrendingUp, MapPin, Cloud, Shield, Leaf, Droplets, Bug, Zap, Thermometer } from "lucide-react";
import { toast } from "sonner";
import { useWeatherData } from "@/hooks/useWeatherData";
import { Checkbox } from "@/components/ui/checkbox";

const Dashboard = () => {
  const [predicting, setPredicting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [cropType, setCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");
  const [temperature, setTemperature] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [location, setLocation] = useState({ lat: 40.7128, lon: -74.0060 }); // Default: New York
  const [fetchWeather, setFetchWeather] = useState(false);
  const [geneticTraits, setGeneticTraits] = useState({
    pestResistance: false,
    highYield: false,
    droughtTolerance: false,
    diseaseResistance: false,
    fastGrowth: false,
    climateAdaptability: false,
  });

  const { weatherData, loading: weatherLoading } = useWeatherData({
    latitude: location.lat,
    longitude: location.lon,
    enabled: fetchWeather,
  });

  useEffect(() => {
    if (weatherData) {
      setTemperature(weatherData.temperature.toString());
      setRainfall(weatherData.rainfall.toString());
      toast.success(`Weather data loaded for ${weatherData.location}`);
    }
  }, [weatherData]);

  const handleFetchWeather = () => {
    setFetchWeather(true);
  };

  const handlePredict = () => {
    if (!cropType || !soilType || !season || !temperature || !rainfall) {
      toast.error("Please fill all fields");
      return;
    }

    const selectedTraits = Object.entries(geneticTraits)
      .filter(([_, selected]) => selected)
      .map(([trait]) => trait);

    if (selectedTraits.length === 0) {
      toast.error("Please select at least one genetic trait");
      return;
    }

    setPredicting(true);
    
    // Simulate AI + Genetic Algorithm processing with selected traits
    setTimeout(() => {
      setPredicting(false);
      setShowResults(true);
      toast.success(`Prediction completed with ${selectedTraits.length} genetic traits optimized!`);
    }, 2000);
  };

  const toggleTrait = (trait: keyof typeof geneticTraits) => {
    setGeneticTraits(prev => ({ ...prev, [trait]: !prev[trait] }));
  };

  const getRecommendedTraits = () => {
    const recommendations: { trait: keyof typeof geneticTraits; reason: string }[] = [];
    
    // Temperature-based recommendations
    const temp = parseFloat(temperature);
    if (!isNaN(temp)) {
      if (temp > 30) {
        recommendations.push({ trait: 'droughtTolerance', reason: 'High temperature detected' });
        recommendations.push({ trait: 'climateAdaptability', reason: 'Extreme heat conditions' });
      } else if (temp < 10) {
        recommendations.push({ trait: 'climateAdaptability', reason: 'Cold climate conditions' });
      }
    }

    // Rainfall-based recommendations
    const rain = parseFloat(rainfall);
    if (!isNaN(rain)) {
      if (rain < 500) {
        recommendations.push({ trait: 'droughtTolerance', reason: 'Low rainfall expected' });
      } else if (rain > 1500) {
        recommendations.push({ trait: 'diseaseResistance', reason: 'High moisture increases disease risk' });
      }
    }

    // Crop-specific recommendations
    if (cropType === 'wheat' || cropType === 'rice') {
      recommendations.push({ trait: 'diseaseResistance', reason: `${cropType} is susceptible to diseases` });
      recommendations.push({ trait: 'highYield', reason: 'Staple crop optimization' });
    } else if (cropType === 'corn') {
      recommendations.push({ trait: 'pestResistance', reason: 'Corn attracts various pests' });
      recommendations.push({ trait: 'highYield', reason: 'High demand crop' });
    } else if (cropType === 'cotton') {
      recommendations.push({ trait: 'pestResistance', reason: 'Cotton bollworm risk' });
      recommendations.push({ trait: 'droughtTolerance', reason: 'Cotton requires water management' });
    }

    // Soil-based recommendations
    if (soilType === 'sandy') {
      recommendations.push({ trait: 'droughtTolerance', reason: 'Sandy soil drains quickly' });
    } else if (soilType === 'clay') {
      recommendations.push({ trait: 'diseaseResistance', reason: 'Clay soil retains moisture' });
    }

    // Season-based recommendations
    if (season === 'summer') {
      recommendations.push({ trait: 'fastGrowth', reason: 'Maximize summer growing season' });
    } else if (season === 'winter') {
      recommendations.push({ trait: 'climateAdaptability', reason: 'Cold season adaptation' });
    }

    // Always recommend high yield as a baseline
    if (!recommendations.some(r => r.trait === 'highYield')) {
      recommendations.push({ trait: 'highYield', reason: 'Maximize productivity' });
    }

    // Remove duplicates
    const uniqueRecommendations = recommendations.reduce((acc, curr) => {
      if (!acc.find(r => r.trait === curr.trait)) {
        acc.push(curr);
      }
      return acc;
    }, [] as typeof recommendations);

    return uniqueRecommendations;
  };

  const applyRecommendations = () => {
    const recommended = getRecommendedTraits();
    const newTraits = { ...geneticTraits };
    recommended.forEach(({ trait }) => {
      newTraits[trait] = true;
    });
    setGeneticTraits(newTraits);
    toast.success(`Applied ${recommended.length} recommended traits`);
  };

  const recommendedTraits = cropType && soilType && season && temperature && rainfall 
    ? getRecommendedTraits() 
    : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Smart Crop Forecasting</h1>
          </div>
          <p className="text-muted-foreground mt-2">AI-Powered Agricultural Intelligence with Genetic Optimization</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Prediction
              </CardTitle>
              <CardDescription>Neural network analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">94.5%</div>
              <p className="text-sm text-muted-foreground mt-1">Accuracy Rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="h-5 w-5 text-secondary" />
                Genetic Algorithm
              </CardTitle>
              <CardDescription>Optimization iterations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">1,247</div>
              <p className="text-sm text-muted-foreground mt-1">Generations</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Yield Improvement
              </CardTitle>
              <CardDescription>Projected increase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">+23.4%</div>
              <p className="text-sm text-muted-foreground mt-1">vs Traditional</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Crop Prediction Parameters</CardTitle>
              <CardDescription>Enter farming conditions for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-primary" />
                    <Label>Real-Time Weather Data</Label>
                  </div>
                  <Button
                    onClick={handleFetchWeather}
                    disabled={weatherLoading}
                    variant="outline"
                    size="sm"
                  >
                    {weatherLoading ? "Loading..." : "Fetch Weather"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-2">
                    <Label htmlFor="lat" className="text-xs text-muted-foreground">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.0001"
                      value={location.lat}
                      onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) })}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lon" className="text-xs text-muted-foreground">Longitude</Label>
                    <Input
                      id="lon"
                      type="number"
                      step="0.0001"
                      value={location.lon}
                      onChange={(e) => setLocation({ ...location, lon: parseFloat(e.target.value) })}
                      className="h-8"
                    />
                  </div>
                </div>
                {weatherData && (
                  <div className="mt-3 p-2 bg-background rounded border border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3" />
                      <span>{weatherData.location}</span>
                    </div>
                    <div className="text-xs">
                      Temp: {weatherData.temperature}°C | Humidity: {weatherData.humidity}%
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="crop">Crop Type</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger id="crop">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="corn">Corn</SelectItem>
                    <SelectItem value="soybean">Soybean</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soil">Soil Type</Label>
                <Select value={soilType} onValueChange={setSoilType}>
                  <SelectTrigger id="soil">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="silty">Silty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger id="season">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring">Spring</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="autumn">Autumn</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temp">Average Temperature (°C)</Label>
                <Input
                  id="temp"
                  type="number"
                  placeholder="e.g., 25"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rain">Expected Rainfall (mm)</Label>
                <Input
                  id="rain"
                  type="number"
                  placeholder="e.g., 750"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Dna className="h-5 w-5 text-secondary" />
                  <Label>Genetic Trait Selection</Label>
                </div>
                
                {recommendedTraits.length > 0 && (
                  <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-primary">AI Recommendations</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Based on your farming conditions</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={applyRecommendations}
                        className="text-xs"
                      >
                        Apply All
                      </Button>
                    </div>
                    <div className="space-y-1.5">
                      {recommendedTraits.map(({ trait, reason }) => (
                        <div 
                          key={trait}
                          className="flex items-start gap-2 text-xs bg-background/50 p-2 rounded"
                        >
                          <Leaf className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium capitalize">
                              {trait.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-muted-foreground"> - {reason}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pestResistance"
                      checked={geneticTraits.pestResistance}
                      onCheckedChange={() => toggleTrait('pestResistance')}
                    />
                    <label
                      htmlFor="pestResistance"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5 cursor-pointer ${
                        recommendedTraits.some(r => r.trait === 'pestResistance') ? 'text-primary' : ''
                      }`}
                    >
                      <Bug className="h-4 w-4 text-primary" />
                      Pest Resistance
                      {recommendedTraits.some(r => r.trait === 'pestResistance') && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">✓</span>
                      )}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="highYield"
                      checked={geneticTraits.highYield}
                      onCheckedChange={() => toggleTrait('highYield')}
                    />
                    <label
                      htmlFor="highYield"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5 cursor-pointer ${
                        recommendedTraits.some(r => r.trait === 'highYield') ? 'text-primary' : ''
                      }`}
                    >
                      <TrendingUp className="h-4 w-4 text-accent" />
                      High Yield
                      {recommendedTraits.some(r => r.trait === 'highYield') && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">✓</span>
                      )}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="droughtTolerance"
                      checked={geneticTraits.droughtTolerance}
                      onCheckedChange={() => toggleTrait('droughtTolerance')}
                    />
                    <label
                      htmlFor="droughtTolerance"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5 cursor-pointer ${
                        recommendedTraits.some(r => r.trait === 'droughtTolerance') ? 'text-primary' : ''
                      }`}
                    >
                      <Droplets className="h-4 w-4 text-primary" />
                      Drought Tolerance
                      {recommendedTraits.some(r => r.trait === 'droughtTolerance') && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">✓</span>
                      )}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="diseaseResistance"
                      checked={geneticTraits.diseaseResistance}
                      onCheckedChange={() => toggleTrait('diseaseResistance')}
                    />
                    <label
                      htmlFor="diseaseResistance"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5 cursor-pointer ${
                        recommendedTraits.some(r => r.trait === 'diseaseResistance') ? 'text-primary' : ''
                      }`}
                    >
                      <Shield className="h-4 w-4 text-secondary" />
                      Disease Resistance
                      {recommendedTraits.some(r => r.trait === 'diseaseResistance') && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">✓</span>
                      )}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fastGrowth"
                      checked={geneticTraits.fastGrowth}
                      onCheckedChange={() => toggleTrait('fastGrowth')}
                    />
                    <label
                      htmlFor="fastGrowth"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5 cursor-pointer ${
                        recommendedTraits.some(r => r.trait === 'fastGrowth') ? 'text-primary' : ''
                      }`}
                    >
                      <Zap className="h-4 w-4 text-accent" />
                      Fast Growth
                      {recommendedTraits.some(r => r.trait === 'fastGrowth') && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">✓</span>
                      )}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="climateAdaptability"
                      checked={geneticTraits.climateAdaptability}
                      onCheckedChange={() => toggleTrait('climateAdaptability')}
                    />
                    <label
                      htmlFor="climateAdaptability"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5 cursor-pointer ${
                        recommendedTraits.some(r => r.trait === 'climateAdaptability') ? 'text-primary' : ''
                      }`}
                    >
                      <Thermometer className="h-4 w-4 text-primary" />
                      Climate Adaptability
                      {recommendedTraits.some(r => r.trait === 'climateAdaptability') && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">✓</span>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePredict} 
                disabled={predicting}
                className="w-full"
                size="lg"
              >
                {predicting ? "Analyzing..." : "Generate Prediction"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {showResults && (
              <>
                <PredictionChart />
                <GeneticAlgorithmViz />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
