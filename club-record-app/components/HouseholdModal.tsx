import React, { useState, useEffect } from 'react';
import { X, Plus, User, Users, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Household } from '../types';
import { dataService } from '../services/dataService';

interface Props {
  household: Household;
  onClose: () => void;
  onRefresh: () => void;
}

export const HouseholdModal: React.FC<Props> = ({ household, onClose, onRefresh }) => {
  const [isEditingInfo, setIsEditingInfo] = useState(!household.name); 
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editForm, setEditForm] = useState<Partial<Household>>(household);
  const [newRecordForm, setNewRecordForm] = useState({ title: '', content: '' });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    if (household.history && household.history.length > 0) {
      setActiveTab(household.history[household.history.length - 1].title);
    }
  }, [household]);

  const handleSaveInfo = async () => {
    setIsSaving(true);
    await dataService.saveHousehold({
      ...(editForm as Household),
      history: household.history || []
    });
    setIsEditingInfo(false);
    setIsSaving(false);
    onRefresh(); 
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordForm.title || !newRecordForm.content) return;
    setIsSaving(true);

    let imageBase64;
    let imageMimeType;
    let imageName;

    if (imageFile) {
      imageBase64 = await convertFileToBase64(imageFile);
      imageMimeType = imageFile.type;
      imageName = imageFile.name;
    }

    const updatedHistory = [
      ...(household.history || []),
      { 
        title: newRecordForm.title, 
        content: newRecordForm.content,
        imageBase64,
        imageMimeType,
        imageName
      }
    ];

    await dataService.saveHousehold({
      ...household,
      history: updatedHistory
    });

    setActiveTab(newRecordForm.title); 
    setNewRecordForm({ title: '', content: '' });
    setImageFile(null);
    setImagePreview(null);
    setIsAddingRecord(false);
    setIsSaving(false);
    onRefresh(); 
  };
  
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // 🔥 核心魔法：解析內容，如果是 Google Drive 網址就直接轉成圖片顯示
  // 🔥 核心魔法：更強大的 Google Drive 網址解析器
  const renderContent = (content: string) => {
    if (!content) return '此分頁尚無內容';

    return content.split(urlRegex).map((part, i) => {
      if (urlRegex.test(part)) {
        // 涵蓋多種 Google Drive 常見網址格式，精準抓出 ID
        const driveMatch = part.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|file\/u\/\d+\/d\/)([a-zA-Z0-9_-]+)/);
        
        if (driveMatch && driveMatch[1]) {
          const fileId = driveMatch[1];
          // 🌟 改變策略：使用 Google 的 Thumbnail API，保證能跨越權限阻擋直接顯示圖片
          const imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
          
          return (
            <span key={i} className="block mt-4 mb-2">
              <a href={part} target="_blank" rel="noopener noreferrer" className="block w-fit hover:opacity-90 transition-opacity" title="點擊去雲端硬碟看原圖">
                <img 
                  src={imageUrl} 
                  alt="家訪附加照片" 
                  className="max-w-full h-auto max-h-[400px] object-contain rounded-lg border border-slate-200 shadow-sm" 
                />
              </a>
            </span>
          );
        }
        
        // 若是一般網址或沒抓到 ID，維持超連結狀態
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all hover:text-blue-700">
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative">
        
        {isSaving && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-3" />
            <p className="font-bold text-slate-700 text-lg">正在上傳資料與照片，請稍候...</p>
          </div>
        )}

        <div className="flex justify-between items-center p-4 border-b bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm shadow-sm">#{household.id}</span>
            {household.name || '未命名家戶'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
          
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
                <User size={18} className="text-blue-500" /> 家庭成員資訊
              </h3>
              {!isEditingInfo && (
                <button onClick={() => setIsEditingInfo(true)} className="text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-full">
                  編輯資訊
                </button>
              )}
            </div>

            {isEditingInfo ? (
              <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">家名/戶長</label>
                  <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">大人</label>
                  <input type="text" value={editForm.adults || ''} onChange={e => setEditForm({...editForm, adults: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">小朋友</label>
                    <input type="text" value={editForm.kids || ''} onChange={e => setEditForm({...editForm, kids: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">大小孩</label>
                    <input type="text" value={editForm.teens || ''} onChange={e => setEditForm({...editForm, teens: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => { setIsEditingInfo(false); setEditForm(household); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
                  <button onClick={handleSaveInfo} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"><Save size={16}/> 儲存</button>
                </div>
              </div>
            ) : (
              <div className="bg-white border shadow-sm rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="bg-slate-100 p-2 rounded-lg"><Users size={18} className="text-slate-500" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">大人</p>
                    <p className="font-medium text-slate-800">{household.adults || '無紀錄'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg"><Users size={18} className="text-slate-500" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">小朋友</p>
                    <p className="font-medium text-slate-800">{household.kids || '無紀錄'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg"><Users size={18} className="text-slate-500" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">大小孩</p>
                    <p className="font-medium text-slate-800">{household.teens || '無紀錄'}</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section>
            
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-px mb-4 scrollbar-hide">
              {household.history?.map((record, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveTab(record.title); setIsAddingRecord(false); }}
                  className={`px-4 py-2.5 whitespace-nowrap text-sm font-bold transition-colors border-b-2 ${
                    !isAddingRecord && activeTab === record.title
                      ? 'border-blue-600 text-blue-700 bg-blue-50 rounded-t-lg'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-t-lg'
                  }`}
                >
                  {record.title}
                </button>
              ))}
              
              <button
                onClick={() => setIsAddingRecord(true)}
                className={`ml-auto px-4 py-2 whitespace-nowrap text-sm font-bold flex items-center gap-1 rounded-t-lg transition-colors border-b-2 ${
                  isAddingRecord
                    ? 'border-green-600 text-green-700 bg-green-50'
                    : 'border-transparent text-green-600 hover:bg-green-50'
                }`}
              >
                <Plus size={16} /> 新增分頁紀錄
              </button>
            </div>

            {isAddingRecord ? (
              <form onSubmit={handleAddRecord} className="bg-green-50/50 p-5 rounded-b-xl rounded-tl-xl border border-green-100 shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">活動/年份標題 (將自動建為試算表 Sheet)</label>
                  <input type="text" required value={newRecordForm.title} onChange={e => setNewRecordForm({...newRecordForm, title: e.target.value})} className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white" placeholder="例如: 25冬" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">家訪故事與細節</label>
                  <textarea required value={newRecordForm.content} onChange={e => setNewRecordForm({...newRecordForm, content: e.target.value})} className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white leading-relaxed" rows={5} placeholder="請輸入家訪紀錄..."></textarea>
                </div>
                
                <div className="bg-white p-4 border border-green-200 rounded-lg">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <ImageIcon size={18} className="text-slate-500"/> 附加照片 (選填)
                  </label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-lg border border-slate-200" />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsAddingRecord(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg font-medium">取消</button>
                  <button type="submit" className="px-5 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-1"><Save size={16}/> 儲存紀錄</button>
                </div>
              </form>
            ) : household.history && household.history.length > 0 ? (
              <div className="bg-white p-6 rounded-b-xl rounded-tr-xl border shadow-sm min-h-[200px]">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-[15px]">
                  {renderContent(household.history.find(h => h.title === activeTab)?.content || '')}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 bg-white border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-400 font-medium">目前沒有任何家訪紀錄，請點擊上方「新增分頁紀錄」</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};