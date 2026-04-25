import CryptoJS from 'crypto-js'
import { useUserStore } from '@/store/modules/user'

export const PasswordCrypto = {
  /**
   * 加密
   * @param {需要加密的参数} password
   * @param {key} desKey
   */
  encryptDes(password, desKey) {
    if (!desKey) {
      return password
    }
    return CryptoJS.DES.encrypt(password, CryptoJS.enc.Utf8.parse(desKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString()
  },
  /**
   *  aes加密
   * @param {需要加密的密码} password
   * @param {*} desKey
   * @param {密钥是否保持原样} keepKeyOrigin
   */
  encrypt(password, desKey?: any, keepKeyOrigin?: any, secretType?: any) {
    if (!desKey) {
      return password
    }
    if (!keepKeyOrigin) {
      desKey = get256Key(desKey)
    }
    if (!secretType) {
      secretType = useUserStore().userInfo?.secretType || ''
    }
    if (secretType === 'des') {
      return PasswordCrypto.encryptDes(password, desKey)
    }
    let key = desKey
    let iv = desKey.substr(0, 16)
    key = CryptoJS.enc.Utf8.parse(key)
    iv = CryptoJS.enc.Utf8.parse(iv)
    return CryptoJS.AES.encrypt(password, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    }).toString()
  },

  /**
   * @param {string} password
   * @param {string} [desKey]
   */
  makeAES(password, desKey?) {
    const userStore = useUserStore()
    if (!desKey) {
      desKey = userStore.userInfo?.userName
    }
    const secretType = userStore.userInfo?.secretType || ''
    return PasswordCrypto.encrypt(password, desKey, false, secretType)
  },
  decrypt(decryptPwd, desKey) {
    const userStore = useUserStore()
    if (!desKey) {
      desKey = userStore.userInfo?.userName
    }
    const secretType = userStore.userInfo?.secretType || ''
    return PasswordCrypto.decryptAes(decryptPwd, desKey, false, secretType)
  },
  decryptAes(password, desKey, keepKeyOrigin, secretType) {
    const userStore = useUserStore()
    if (!desKey) {
      return password
    }
    if (!keepKeyOrigin) {
      desKey = get256Key(desKey)
    }
    if (!secretType) {
      secretType = userStore.userInfo?.secretType || ''
    }
    if (secretType === 'des') {
      return PasswordCrypto.decryptDes(password, desKey)
    }
    let key = desKey
    let iv = desKey.substr(0, 16)
    key = CryptoJS.enc.Utf8.parse(key)
    iv = CryptoJS.enc.Utf8.parse(iv)
    const decryptData = CryptoJS.AES.decrypt(password, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    })
    return CryptoJS.enc.Utf8.stringify(decryptData).toString()
  },
  decryptDes(password, desKey) {
    if (!desKey) {
      return password
    }
    const decryptData = CryptoJS.DES.decrypt(password, CryptoJS.enc.Utf8.parse(desKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return CryptoJS.enc.Utf8.stringify(decryptData).toString()
  },
}

function get256Key(referKey) {
  const desKey = CryptoJS.SHA1(referKey).toString()
  let j = 0
  const desKeyLength = desKey.length
  let key = ''
  for (let i = 0; i < 32; i++) {
    if (j >= desKeyLength) {
      j = 0
    }
    key += desKey[j]
    j++
  }
  return key
}
