"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Download, Share } from "lucide-react"

interface FormSettingsProps {
  form: any
}

export default function FormSettings({ form }: FormSettingsProps) {
  const [settings, setSettings] = useState({
    allowMultipleSubmissions: false,
    requireLogin: false,
    showProgressBar: true,
    emailNotifications: true,
    customTheme: "default",
    redirectUrl: "",
    thankYouMessage: "Thank you for your submission!",
  })

  if (!form) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">Select a form to configure its settings.</div>
        </CardContent>
      </Card>
    )
  }

  const generateEmbedCode = () => {
    return `<iframe src="${window.location.origin}/embed/form/${form.id}" width="100%" height="600" frameborder="0"></iframe>`
  }

  const generateShareUrl = () => {
    return `${window.location.origin}/form/${form.id}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Settings</CardTitle>
            <CardDescription>Configure how your form behaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Multiple Submissions</Label>
                <div className="text-sm text-muted-foreground">Allow users to submit the form multiple times</div>
              </div>
              <Switch
                checked={settings.allowMultipleSubmissions}
                onCheckedChange={(checked) => setSettings({ ...settings, allowMultipleSubmissions: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Login</Label>
                <div className="text-sm text-muted-foreground">Users must be logged in to submit</div>
              </div>
              <Switch
                checked={settings.requireLogin}
                onCheckedChange={(checked) => setSettings({ ...settings, requireLogin: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Progress Bar</Label>
                <div className="text-sm text-muted-foreground">Display progress for multi-step forms</div>
              </div>
              <Switch
                checked={settings.showProgressBar}
                onCheckedChange={(checked) => setSettings({ ...settings, showProgressBar: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <div className="text-sm text-muted-foreground">Send email when form is submitted</div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={settings.customTheme}
                onValueChange={(value) => setSettings({ ...settings, customTheme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirect">Redirect URL (Optional)</Label>
              <Input
                id="redirect"
                value={settings.redirectUrl}
                onChange={(e) => setSettings({ ...settings, redirectUrl: e.target.value })}
                placeholder="https://example.com/thank-you"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thank-you">Thank You Message</Label>
              <Textarea
                id="thank-you"
                value={settings.thankYouMessage}
                onChange={(e) => setSettings({ ...settings, thankYouMessage: e.target.value })}
                placeholder="Enter thank you message"
              />
            </div>

            <Button className="w-full">Save Settings</Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Share & Embed</CardTitle>
            <CardDescription>Share your form or embed it on your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Share URL</Label>
              <div className="flex gap-2">
                <Input value={generateShareUrl()} readOnly className="flex-1" />
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateShareUrl())}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Embed Code</Label>
              <div className="flex gap-2">
                <Textarea value={generateEmbedCode()} readOnly className="flex-1 h-20" />
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateEmbedCode())}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Analytics</CardTitle>
            <CardDescription>View form performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{form.responses}</div>
                <div className="text-sm text-muted-foreground">Total Responses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
