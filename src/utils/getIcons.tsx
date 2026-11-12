import { BrowserName, OSName } from 'ua-parser-js/enums';

import { FaAndroid, FaApple, FaEdge, FaLinux, FaQuestion, FaWindows } from "react-icons/fa";
import { FaChrome, FaFirefoxBrowser, FaSafari, FaOpera} from "react-icons/fa"
import { SiGnome, SiKde, SiLibrewolf, SiSamsung, SiVivaldi } from "react-icons/si";
import { FaBrave } from 'react-icons/fa6';

export function getOSIcon(os: string | undefined) {
  switch(os) {
    case OSName.WINDOWS: return <FaWindows size={64}/>
    case OSName.LINUX: return <FaLinux size={64}/>
    case OSName.MACOS: return <FaApple size={64}/>
    case OSName.IOS: return <FaApple size={64}/>
    case OSName.ANDROID: return <FaAndroid size={64}/>
    default: return <FaQuestion />
  }
}

export function getBrowserIcon(browser: string | undefined) {
  switch(browser) {
    case BrowserName.CHROME: return <FaChrome size={36}/>
    case BrowserName.CHROME_WEBVIEW: return <FaChrome size={36}/>
    case BrowserName.CHROME_MOBILE: return <FaChrome size={36}/>
    case BrowserName.FIREFOX: return <FaFirefoxBrowser size={36}/>
    case BrowserName.FIREFOX_MOBILE: return <FaFirefoxBrowser size={36}/>
    case BrowserName.WATERFOX: return <FaFirefoxBrowser size={36}/>
    case BrowserName.SAFARI: return <FaSafari size={36}/>
    case BrowserName.SAFARI_MOBILE: return <FaSafari size={36}/>
    case BrowserName.BRAVE: return <FaBrave size={36}/>
    case BrowserName.EDGE: return <FaEdge size={36}/>
    case BrowserName.OPERA: return <FaOpera size={36}/>
    case BrowserName.OPERA_GX: return <FaOpera size={36}/>
    case BrowserName.SAMSUNG: return <SiSamsung size={36} />
    case BrowserName.VIVALDI: return <SiVivaldi size={36} />
    case BrowserName.LIBREWOLF: return <SiLibrewolf size={36} />
    case BrowserName.EPIPHANY: return <SiGnome size={36} />
    case BrowserName.FALKON: return <SiKde size={36} />
    default: return <FaQuestion size={36}/>
  }
}