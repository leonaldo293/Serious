'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Save, 
  RefreshCw, 
  Globe, 
  CreditCard, 
  Zap, 
  Shield, 
  Mail, 
  Bell,
  Database,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { useToast } from '@/components/Toast'

interface SystemSettings {
  site: {
    name: string
    description: string
    logo: string
    favicon: string
    contactEmail: string
    supportPhone: string
    address: string
    timezone: string
    language: string
    theme: {
      primaryColor: string
      secondaryColor: string
      darkMode: boolean
      customCSS: string
    }
  }
  payment: {
    paypalEnabled: boolean
    paypalEmail: string
    paypalClientId: string
    paypalSecret: string
    paypalSandbox: boolean
    whatsappEnabled: boolean
    whatsappNumber: string
    whatsappToken: string
    currency: string
    taxRate: number
    invoicePrefix: string
    autoInvoice: boolean
  }
  features: {
    registrationEnabled: boolean
    emailVerificationRequired: boolean
    socialLoginEnabled: boolean
    notificationsEnabled: boolean
    maintenanceMode: boolean
    betaFeatures: boolean
    apiAccess: boolean
    webhooks: boolean
  }
  security: {
    sessionTimeout: number
    passwordMinLength: number
    passwordRequireUppercase: boolean
    passwordRequireNumbers: boolean
    passwordRequireSymbols: boolean
    twoFactorAuth: boolean
    maxLoginAttempts: number
    lockoutDuration: number
    allowedIPs: string[]
  }
  limits: {
    maxUsersPerProgram: number
    maxFileSize: number
    maxUploadsPerUser: number
    apiRateLimit: number
    concurrentSessions: number
    storageQuota: number
  }
  emails: {
    welcomeEmailEnabled: boolean
    paymentConfirmationEnabled: boolean
    courseCompletionEnabled: boolean
    passwordResetEnabled: boolean
    newsletterEnabled: boolean
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    smtpSecure: boolean
  }
  notifications: {
    pushEnabled: boolean
    emailEnabled: boolean
    smsEnabled: boolean
    browserNotifications: boolean
    mobileNotifications: boolean
    digestFrequency: string
  }
  backup: {
    autoBackup: boolean
    backupFrequency: string
    retentionDays: number
    backupLocation: string
    encryptionEnabled: boolean
  }
}

export default function SettingsManagement() {
  const [settings, setSettings] = useState<SystemSettings>({
    site: {
      name: 'ELTx HUB',
      description: 'Empowering Africa Through Innovation',
      logo: '/logo.png',
      favicon: '/favicon.ico',
      contactEmail: 'contact@eltxhub.com',
      supportPhone: '+244 939 947 819',
      address: 'Luanda, Angola',
      timezone: 'Africa/Luanda',
      language: 'pt',
      theme: {
        primaryColor: '#D4A017',
        secondaryColor: '#00B6A1',
        darkMode: false,
        customCSS: ''
      }
    },
    payment: {
      paypalEnabled: true,
      paypalEmail: 'payments@eltxhub.com',
      paypalClientId: '',
      paypalSecret: '',
      paypalSandbox: true,
      whatsappEnabled: true,
      whatsappNumber: '939947819',
      whatsappToken: '',
      currency: 'AOA',
      taxRate: 14,
      invoicePrefix: 'INV-',
      autoInvoice: true
    },
    features: {
      registrationEnabled: true,
      emailVerificationRequired: true,
      socialLoginEnabled: false,
      notificationsEnabled: true,
      maintenanceMode: false,
      betaFeatures: false,
      apiAccess: true,
      webhooks: false
    },
    security: {
      sessionTimeout: 3600,
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: false,
      twoFactorAuth: false,
      maxLoginAttempts: 5,
      lockoutDuration: 900,
      allowedIPs: []
    },
    limits: {
      maxUsersPerProgram: 1000,
      maxFileSize: 10485760,
      maxUploadsPerUser: 50,
      apiRateLimit: 1000,
      concurrentSessions: 3,
      storageQuota: 1073741824
    },
    emails: {
      welcomeEmailEnabled: true,
      paymentConfirmationEnabled: true,
      courseCompletionEnabled: true,
      passwordResetEnabled: true,
      newsletterEnabled: false,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      smtpSecure: true
    },
    notifications: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      browserNotifications: true,
      mobileNotifications: true,
      digestFrequency: 'daily'
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      backupLocation: 'local',
      encryptionEnabled: true
    }
  })

  const [activeTab, setActiveTab] = useState('site')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const { showToast } = useToast()

  const tabs = [
    { id: 'site', label: 'Site Settings', icon: Globe },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'limits', label: 'Limits', icon: Lock },
    { id: 'emails', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Database }
  ]

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      // In a real implementation, you would fetch from API
      // For now, we'll just use the initial state
      console.log('Settings fetched (mock)')
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSettingChange = (category: keyof SystemSettings, setting: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
  }

  const handleThemeChange = (setting: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      site: {
        ...prev.site,
        theme: {
          ...prev.site.theme,
          [setting]: value
        }
      }
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // API call to save settings
      // await api.put('/settings', settings)
      
      showToast({
        title: 'Success',
        message: 'Settings saved successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      showToast({
        title: 'Error',
        message: 'Failed to save settings',
        type: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      fetchSettings()
    }
  }

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'site':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.site.name}
                  onChange={(e) => handleSettingChange('site', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.site.contactEmail}
                  onChange={(e) => handleSettingChange('site', 'contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={settings.site.description}
                onChange={(e) => handleSettingChange('site', 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Support Phone
                </label>
                <input
                  type="tel"
                  value={settings.site.supportPhone}
                  onChange={(e) => handleSettingChange('site', 'supportPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.site.timezone}
                  onChange={(e) => handleSettingChange('site', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                >
                  <option value="Africa/Luanda">Africa/Luanda</option>
                  <option value="Europe/Lisbon">Europe/Lisbon</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.site.language}
                  onChange={(e) => handleSettingChange('site', 'language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                value={settings.site.address}
                onChange={(e) => handleSettingChange('site', 'address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.site.theme.primaryColor}
                      onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                      className="h-10 w-20 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.site.theme.primaryColor}
                      onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.site.theme.secondaryColor}
                      onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                      className="h-10 w-20 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.site.theme.secondaryColor}
                      onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.site.theme.darkMode}
                    onChange={(e) => handleThemeChange('darkMode', e.target.checked)}
                    className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom CSS
                </label>
                <textarea
                  value={settings.site.theme.customCSS}
                  onChange={(e) => handleThemeChange('customCSS', e.target.value)}
                  rows={6}
                  placeholder="Enter custom CSS rules..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                PayPal Configuration
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable PayPal
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.payment.paypalEnabled}
                    onChange={(e) => handleSettingChange('payment', 'paypalEnabled', e.target.checked)}
                    className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PayPal Email
                  </label>
                  <input
                    type="email"
                    value={settings.payment.paypalEmail}
                    onChange={(e) => handleSettingChange('payment', 'paypalEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                    disabled={!settings.payment.paypalEnabled}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Client ID
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.paypalClientId ? 'text' : 'password'}
                        value={settings.payment.paypalClientId}
                        onChange={(e) => handleSettingChange('payment', 'paypalClientId', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                        disabled={!settings.payment.paypalEnabled}
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('paypalClientId')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets.paypalClientId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.paypalSecret ? 'text' : 'password'}
                        value={settings.payment.paypalSecret}
                        onChange={(e) => handleSettingChange('payment', 'paypalSecret', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                        disabled={!settings.payment.paypalEnabled}
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('paypalSecret')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets.paypalSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sandbox Mode
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.payment.paypalSandbox}
                    onChange={(e) => handleSettingChange('payment', 'paypalSandbox', e.target.checked)}
                    className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                    disabled={!settings.payment.paypalEnabled}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                WhatsApp Configuration
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable WhatsApp
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.payment.whatsappEnabled}
                    onChange={(e) => handleSettingChange('payment', 'whatsappEnabled', e.target.checked)}
                    className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={settings.payment.whatsappNumber}
                    onChange={(e) => handleSettingChange('payment', 'whatsappNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                    disabled={!settings.payment.whatsappEnabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Token
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.whatsappToken ? 'text' : 'password'}
                      value={settings.payment.whatsappToken}
                      onChange={(e) => handleSettingChange('payment', 'whatsappToken', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                      disabled={!settings.payment.whatsappEnabled}
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('whatsappToken')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.whatsappToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={settings.payment.currency}
                  onChange={(e) => handleSettingChange('payment', 'currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                >
                  <option value="AOA">AOA - Kwanza</option>
                  <option value="USD">USD - Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={settings.payment.taxRate}
                  onChange={(e) => handleSettingChange('payment', 'taxRate', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Invoice Prefix
                </label>
                <input
                  type="text"
                  value={settings.payment.invoicePrefix}
                  onChange={(e) => handleSettingChange('payment', 'invoicePrefix', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto Generate Invoices
                </label>
                <input
                  type="checkbox"
                  checked={settings.payment.autoInvoice}
                  onChange={(e) => handleSettingChange('payment', 'autoInvoice', e.target.checked)}
                  className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                />
              </div>
            </div>
          </div>
        )

      case 'features':
        return (
          <div className="space-y-4">
            {Object.entries(settings.features).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {key === 'registrationEnabled' && 'Allow new users to register'}
                    {key === 'emailVerificationRequired' && 'Require email verification'}
                    {key === 'socialLoginEnabled' && 'Enable social media login'}
                    {key === 'notificationsEnabled' && 'Send email notifications'}
                    {key === 'maintenanceMode' && 'Put site in maintenance mode'}
                    {key === 'betaFeatures' && 'Enable beta features'}
                    {key === 'apiAccess' && 'Allow API access'}
                    {key === 'webhooks' && 'Enable webhook integrations'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={(e) => handleSettingChange('features', key, e.target.checked)}
                  className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                />
              </div>
            ))}
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Timeout (seconds)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password Min Length
                </label>
                <input
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="6"
                  max="20"
                />
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries({
                passwordRequireUppercase: 'Require uppercase letters',
                passwordRequireNumbers: 'Require numbers',
                passwordRequireSymbols: 'Require symbols',
                twoFactorAuth: 'Enable two-factor authentication'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.security[key as keyof typeof settings.security] as boolean}
                    onChange={(e) => handleSettingChange('security', key, e.target.checked)}
                    className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lockout Duration (seconds)
                </label>
                <input
                  type="number"
                  value={settings.security.lockoutDuration}
                  onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="60"
                />
              </div>
            </div>
          </div>
        )

      case 'limits':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Users Per Program
                </label>
                <input
                  type="number"
                  value={settings.limits.maxUsersPerProgram}
                  onChange={(e) => handleSettingChange('limits', 'maxUsersPerProgram', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max File Size (bytes)
                </label>
                <input
                  type="number"
                  value={settings.limits.maxFileSize}
                  onChange={(e) => handleSettingChange('limits', 'maxFileSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {(settings.limits.maxFileSize / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Uploads Per User
                </label>
                <input
                  type="number"
                  value={settings.limits.maxUploadsPerUser}
                  onChange={(e) => handleSettingChange('limits', 'maxUploadsPerUser', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Rate Limit (requests/hour)
                </label>
                <input
                  type="number"
                  value={settings.limits.apiRateLimit}
                  onChange={(e) => handleSettingChange('limits', 'apiRateLimit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Concurrent Sessions
                </label>
                <input
                  type="number"
                  value={settings.limits.concurrentSessions}
                  onChange={(e) => handleSettingChange('limits', 'concurrentSessions', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Storage Quota (bytes)
                </label>
                <input
                  type="number"
                  value={settings.limits.storageQuota}
                  onChange={(e) => handleSettingChange('limits', 'storageQuota', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {(settings.limits.storageQuota / 1024 / 1024 / 1024).toFixed(1)} GB
                </p>
              </div>
            </div>
          </div>
        )

      case 'emails':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {Object.entries({
                welcomeEmailEnabled: 'Send welcome emails',
                paymentConfirmationEnabled: 'Send payment confirmations',
                courseCompletionEnabled: 'Send course completion notifications',
                passwordResetEnabled: 'Allow password reset via email',
                newsletterEnabled: 'Enable newsletter subscriptions'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emails[key as keyof typeof settings.emails] as boolean}
                    onChange={(e) => handleSettingChange('emails', key, e.target.checked)}
                    className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">SMTP Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.emails.smtpHost}
                    onChange={(e) => handleSettingChange('emails', 'smtpHost', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.emails.smtpPort}
                    onChange={(e) => handleSettingChange('emails', 'smtpPort', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP User
                  </label>
                  <input
                    type="email"
                    value={settings.emails.smtpUser}
                    onChange={(e) => handleSettingChange('emails', 'smtpUser', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.smtpPassword ? 'text' : 'password'}
                      value={settings.emails.smtpPassword}
                      onChange={(e) => handleSettingChange('emails', 'smtpPassword', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('smtpPassword')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.smtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Use SSL/TLS
                </label>
                <input
                  type="checkbox"
                  checked={settings.emails.smtpSecure}
                  onChange={(e) => handleSettingChange('emails', 'smtpSecure', e.target.checked)}
                  className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                />
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-4">
            {Object.entries({
              pushEnabled: 'Enable push notifications',
              emailEnabled: 'Enable email notifications',
              smsEnabled: 'Enable SMS notifications',
              browserNotifications: 'Enable browser notifications',
              mobileNotifications: 'Enable mobile notifications'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                  onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                  className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                />
              </div>
            ))}

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Digest Frequency
              </label>
              <select
                value={settings.notifications.digestFrequency}
                onChange={(e) => handleSettingChange('notifications', 'digestFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="immediately">Immediately</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        )

      case 'backup':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {Object.entries({
                autoBackup: 'Enable automatic backups',
                encryptionEnabled: 'Enable backup encryption'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.backup[key as keyof typeof settings.backup] as boolean}
                    onChange={(e) => handleSettingChange('backup', key, e.target.checked)}
                    className="w-4 h-4 text-african-gold border-gray-300 rounded focus:ring-african-gold"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={settings.backup.backupFrequency}
                  onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Retention Days
                </label>
                <input
                  type="number"
                  value={settings.backup.retentionDays}
                  onChange={(e) => handleSettingChange('backup', 'retentionDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Backup Location
              </label>
              <select
                value={settings.backup.backupLocation}
                onChange={(e) => handleSettingChange('backup', 'backupLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="local">Local Storage</option>
                <option value="s3">Amazon S3</option>
                <option value="google">Google Cloud Storage</option>
                <option value="azure">Azure Blob Storage</option>
              </select>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Settings
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 mr-8">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-african-gold text-gray-900 font-medium'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-african-gold" />
                </div>
              ) : (
                renderSettingsContent()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
