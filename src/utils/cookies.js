import Cookies from 'js-cookie'

// 儲存在cookies時，應以何種名稱為key
const languageKey = 'language'
// 取得cookies設定中的語言設定項目
export const getLanguage = () => Cookies.get(languageKey)
// 語言設定變更時，寫入cookies
export const setLanguage = (language) => Cookies.set(languageKey, language)