import { Clock, Play, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
interface Lesson {
  title: string;
  duration: string;
  preview?: boolean;
  locked?: boolean;
  completed?: boolean;
}

interface Section {
  title: string;
  totalLessons: number;
  totalDuration: string;
  lessons: Lesson[];
}

export function Curriculum({ sections }: { sections: Section[] }) {

  return (
    <div className="space-y-6">
      {sections.map((section, i) => (
        <div key={i} className="border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{section.title}</h3>
              <p className="text-sm text-muted-foreground">
                {section.totalLessons} Lessons • {section.totalDuration}
              </p>
            </div>
          </div>

          <div className="divide-y">
            {section.lessons.map((lesson, j) => (
              <div key={j} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  {lesson.preview ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  ) : lesson.locked ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">{lesson.title}</span>
                  {lesson.completed && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {lesson.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}