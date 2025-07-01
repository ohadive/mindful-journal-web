import React, { useState, useEffect } from 'react'
import { FaTimes, FaCog, FaKeyboard, FaPalette, FaSave } from 'react-icons/fa'

export interface AppSettings {
  autoSaveInterval: number // in seconds
  theme: 'light' | 'dark' | 'system'
  keyboardShortcutsEnabled: boolean
  exportIncludeMetadata: boolean
}

const defaultSettings: AppSettings = {
  autoSaveInterval: 10,
  theme: 'system',
  keyboardShortcutsEnabled: true,
  exportIncludeMetadata: true,
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setLocalSettings(settings)
    setHasChanges(false)
  }, [settings, isOpen])

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(settings))
  }

  const handleSave = () => {
    onSettingsChange(localSettings)
    setHasChanges(false)
    onClose()
  }

  const handleReset = () => {
    setLocalSettings(settings)
    setHasChanges(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <FaCog className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            title="Close settings"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Auto-save Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FaSave className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">Auto-save</h3>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Auto-save interval
              </label>
              <select
                value={localSettings.autoSaveInterval}
                onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={0}>Disabled</option>
              </select>
              <p className="text-xs text-muted-foreground">
                How often to automatically save your entries while typing
              </p>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FaPalette className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">Appearance</h3>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Theme preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleSettingChange('theme', theme)}
                    className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                      localSettings.theme === theme
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-input hover:bg-accent'
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Choose your preferred color theme
              </p>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FaKeyboard className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">Keyboard Shortcuts</h3>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localSettings.keyboardShortcutsEnabled}
                  onChange={(e) => handleSettingChange('keyboardShortcutsEnabled', e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border border-input rounded focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm text-foreground">Enable keyboard shortcuts</span>
              </label>
              <p className="text-xs text-muted-foreground ml-7">
                Enable global keyboard shortcuts for faster navigation
              </p>
            </div>
          </div>

          {/* Export Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground">Export</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localSettings.exportIncludeMetadata}
                  onChange={(e) => handleSettingChange('exportIncludeMetadata', e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border border-input rounded focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm text-foreground">Include metadata in exports</span>
              </label>
              <p className="text-xs text-muted-foreground ml-7">
                Include creation date, word count, and other metadata when exporting entries
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Changes
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for managing settings
export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('journalSettings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings)
    localStorage.setItem('journalSettings', JSON.stringify(newSettings))
  }

  return { settings, updateSettings }
}