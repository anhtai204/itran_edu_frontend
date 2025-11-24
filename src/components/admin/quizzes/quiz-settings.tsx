"use client"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface QuizSettingsProps {
  settings: {
    timeLimit: number
    passingScore: number
    shuffleQuestions: boolean
    showResults: boolean
    attemptsAllowed: number
  }
  onChange: (data: any) => void
}

export default function QuizSettings({ settings, onChange }: QuizSettingsProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Time Settings</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <span className="text-sm text-muted-foreground">{settings.timeLimit} min</span>
            </div>
            <Slider
              id="timeLimit"
              min={1}
              max={180}
              step={1}
              value={[settings.timeLimit]}
              onValueChange={(value) => handleChange("timeLimit", value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 min</span>
              <span>3 hours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Scoring Settings</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <span className="text-sm text-muted-foreground">{settings.passingScore}%</span>
            </div>
            <Slider
              id="passingScore"
              min={0}
              max={100}
              step={5}
              value={[settings.passingScore]}
              onValueChange={(value) => handleChange("passingScore", value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Attempt Settings</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="attemptsAllowed">Attempts Allowed</Label>
            <Select
              value={settings.attemptsAllowed.toString()}
              onValueChange={(value) => handleChange("attemptsAllowed", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of attempts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 attempt</SelectItem>
                <SelectItem value="2">2 attempts</SelectItem>
                <SelectItem value="3">3 attempts</SelectItem>
                <SelectItem value="5">5 attempts</SelectItem>
                <SelectItem value="10">10 attempts</SelectItem>
                <SelectItem value="-1">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Display Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="shuffleQuestions" className="flex-1">
              Shuffle Questions
              <p className="text-sm text-muted-foreground">Questions will appear in random order for each attempt</p>
            </Label>
            <Switch
              id="shuffleQuestions"
              checked={settings.shuffleQuestions}
              onCheckedChange={(checked) => handleChange("shuffleQuestions", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showResults" className="flex-1">
              Show Results After Completion
              <p className="text-sm text-muted-foreground">Students will see their score and correct answers</p>
            </Label>
            <Switch
              id="showResults"
              checked={settings.showResults}
              onCheckedChange={(checked) => handleChange("showResults", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
