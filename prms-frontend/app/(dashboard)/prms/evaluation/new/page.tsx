"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, BarChart3, TrendingUp, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EvaluationCriteria {
  id: number;
  name: string;
  weight: number;
  score: number;
  weightedScore: number;
}

export default function NewEvaluationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rfqNumber: "",
    evaluationDate: new Date().toISOString().split('T')[0],
    evaluator: "John Doe",
    evaluationMethod: "SCORING",
    status: "DRAFT",
    comments: "",
  });

  const [criteria, setCriteria] = useState<EvaluationCriteria[]>([
    { id: 1, name: "Price", weight: 30, score: 0, weightedScore: 0 },
    { id: 2, name: "Quality", weight: 25, score: 0, weightedScore: 0 },
    { id: 3, name: "Delivery Time", weight: 20, score: 0, weightedScore: 0 },
    { id: 4, name: "Past Performance", weight: 15, score: 0, weightedScore: 0 },
    { id: 5, name: "Payment Terms", weight: 10, score: 0, weightedScore: 0 },
  ]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCriteriaChange = (index: number, field: string, value: number) => {
    const newCriteria = [...criteria];
    newCriteria[index] = {
      ...newCriteria[index],
      [field]: value,
      weightedScore: field === "score" ? (newCriteria[index].weight * value) / 100 : (value * newCriteria[index].score) / 100,
    };
    setCriteria(newCriteria);
  };

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const totalScore = criteria.reduce((sum, c) => sum + c.weightedScore, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rfqNumber || !formData.evaluator) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (totalWeight !== 100) {
      toast({
        title: "Validation Error",
        description: "Total weight must equal 100%.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Evaluation Created",
        description: `Evaluation for RFQ ${formData.rfqNumber} has been created successfully.`,
      });
      
      // Redirect to evaluation list
      setTimeout(() => {
        router.push("/prms/evaluation");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create evaluation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href="/prms/evaluation">
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Evaluation</h2>
            <p className="text-gray-400 mt-2">
              Evaluate and score supplier quotations
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Evaluation Details */}
        <Card className="bg-white border border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-gray-900">Evaluation Information</CardTitle>
            <CardDescription className="text-gray-400">
              Basic evaluation setup and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rfqNumber" className="text-gray-300">RFQ Number *</Label>
                <Input
                  id="rfqNumber"
                  value={formData.rfqNumber}
                  onChange={(e) => handleInputChange("rfqNumber", e.target.value)}
                  className="border-gray-300 text-gray-900"
                  placeholder="RFQ-2024-00123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluator" className="text-gray-300">Evaluator *</Label>
                <Input
                  id="evaluator"
                  value={formData.evaluator}
                  onChange={(e) => handleInputChange("evaluator", e.target.value)}
                  className="border-gray-300 text-gray-900"
                  placeholder="Evaluator name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evaluationDate" className="text-gray-300">Evaluation Date</Label>
                <Input
                  id="evaluationDate"
                  type="date"
                  value={formData.evaluationDate}
                  onChange={(e) => handleInputChange("evaluationDate", e.target.value)}
                  className="border-gray-300 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluationMethod" className="text-gray-300">Evaluation Method</Label>
                <Select value={formData.evaluationMethod} onValueChange={(value) => handleInputChange("evaluationMethod", value)}>
                  <SelectTrigger className="border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="SCORING">Scoring</SelectItem>
                    <SelectItem value="RANKING">Ranking</SelectItem>
                    <SelectItem value="WEIGHTED">Weighted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments" className="text-gray-300">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                className="border-gray-300 text-gray-900 min-h-[100px]"
                placeholder="Additional evaluation notes and observations"
              />
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Criteria */}
        <Card className="bg-white border border-gray-200 mb-6">
          <CardHeader>
            <div>
              <CardTitle className="text-gray-900 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-red-500" />
                <span>Evaluation Criteria</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Set criteria weights and scores (Total weight must equal 100%)
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {criteria.map((criterion, index) => (
              <div key={criterion.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Criterion</Label>
                    <Input
                      value={criterion.name}
                      disabled
                      className="bg-white border border-gray-200 text-gray-300 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Weight (%)</Label>
                    <Input
                      type="number"
                      value={criterion.weight}
                      onChange={(e) => handleCriteriaChange(index, "weight", parseInt(e.target.value) || 0)}
                      className="bg-white border border-gray-200 text-white text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Score (0-100)</Label>
                    <Input
                      type="number"
                      value={criterion.score}
                      onChange={(e) => handleCriteriaChange(index, "score", parseInt(e.target.value) || 0)}
                      className="bg-white border border-gray-200 text-white text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Weighted Score</Label>
                    <Input
                      value={criterion.weightedScore.toFixed(2)}
                      disabled
                      className="bg-white border border-gray-200 text-green-400 text-sm font-medium"
                    />
                  </div>
                  <div className="flex items-end pt-2">
                    <div className="w-full flex items-center justify-center h-10 bg-gray-100 rounded border border-gray-200">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="ml-1 text-sm text-yellow-400">{criterion.score}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="p-4 bg-white rounded-lg border border-gray-200 grid grid-cols-3 gap-4">
              <div className="text-center">
                <span className="text-xs text-gray-500">Total Weight</span>
                <div className={`text-2xl font-bold mt-1 ${totalWeight === 100 ? "text-green-400" : "text-red-400"}`}>
                  {totalWeight}%
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">Average Score</span>
                <div className="text-2xl font-bold text-blue-400 mt-1">
                  {(criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length).toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">Final Score</span>
                <div className="text-2xl font-bold text-red-400 mt-1">
                  {totalScore.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            asChild
          >
            <a href="/prms/evaluation">Cancel</a>
          </Button>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700"
            disabled={loading || totalWeight !== 100}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Creating..." : "Create Evaluation"}
          </Button>
        </div>
      </form>
    </div>
  );
}


