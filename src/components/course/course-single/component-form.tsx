import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export function CommentForm() {
  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-xl font-semibold mb-6">Leave A Comment</h3>
      <form className="space-y-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your email address will not be published. Required fields are marked *
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              placeholder="Name*"
              required
              className="h-12 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email*"
              required
              className="h-12 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div>
          <Textarea
            placeholder="Comment"
            required
            className="min-h-[150px] rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="save-info" />
          <label
            htmlFor="save-info"
            className="text-sm font-medium leading-none text-gray-600 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save my name, email in this browser for the next time I comment
          </label>
        </div>

        <Button
          type="submit"
          className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600"
        >
          Post Comment
        </Button>
      </form>
    </div>
  )
}