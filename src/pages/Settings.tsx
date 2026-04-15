import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import type { Language } from '../i18n';
import { Globe, User, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  const { lang, setLang } = useApp();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.title', lang)}</h1>
        <p className="text-sm text-gray-500 mt-1">จัดการการตั้งค่าระบบ</p>
      </div>

      {/* Language */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('settings.language', lang)}</h3>
            <p className="text-xs text-gray-500">เลือกภาษาที่ใช้แสดงผลในระบบ</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-3">
            {[
              { code: 'th' as Language, label: 'ไทย', flag: '🇹🇭' },
              { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
            ].map((option) => (
              <button
                key={option.code}
                onClick={() => setLang(option.code)}
                className={`flex items-center gap-3 rounded-lg border-2 px-5 py-3 transition-all ${
                  lang === option.code
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{option.flag}</span>
                <div className="text-left">
                  <p className={`text-sm font-medium ${lang === option.code ? 'text-primary-700' : 'text-gray-900'}`}>
                    {option.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('settings.profile', lang)}</h3>
            <p className="text-xs text-gray-500">ข้อมูลตัวแทนประกัน</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
              <input type="text" defaultValue="สมศักดิ์ ประกันดี" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เลขที่ใบอนุญาต</label>
              <input type="text" defaultValue="6601012345" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input type="email" defaultValue="somsakagent@email.com" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">โทรศัพท์</label>
              <input type="text" defaultValue="081-999-8888" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              {t('common.save', lang)}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('settings.notifications', lang)}</h3>
            <p className="text-xs text-gray-500">ตั้งค่าการแจ้งเตือน</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'แจ้งเตือนการต่ออายุ (7 วันก่อน)', defaultChecked: true },
            { label: 'แจ้งเตือนการต่ออายุ (14 วันก่อน)', defaultChecked: true },
            { label: 'แจ้งเตือนการต่ออายุ (30 วันก่อน)', defaultChecked: false },
            { label: 'แจ้งเตือนตั๋วงานใหม่', defaultChecked: true },
            { label: 'แจ้งเตือนลีดใหม่', defaultChecked: true },
          ].map((item, i) => (
            <label key={i} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{item.label}</span>
              <input
                type="checkbox"
                defaultChecked={item.defaultChecked}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('settings.appearance', lang)}</h3>
            <p className="text-xs text-gray-500">ปรับแต่งหน้าตาระบบ</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500">ระบบใช้ธีมสว่าง (Light Mode) เป็นค่าเริ่มต้น</p>
        </div>
      </div>
    </div>
  );
}
