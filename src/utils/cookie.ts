interface CookieProperties {
  expires?: number | Date | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  samesite?: 'strict' | 'lax' | 'none';
  [key: string]: string | number | boolean | Date | undefined;
}

export function setCookie(name: string, value: string, props: CookieProperties = {}): void {
  let exp = props.expires;

  if (typeof exp === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = d;
  }

  if (exp instanceof Date) {
    props.expires = exp.toUTCString();
  } else if (exp) {
    props.expires = String(exp);
  }

  const encodedValue = encodeURIComponent(value);
  let updatedCookie = `${name}=${encodedValue}`;

  for (const propName in props) {
    if (Object.prototype.hasOwnProperty.call(props, propName)) {
      const propValue = props[propName];
      if (propValue === undefined || (propName === 'expires' && exp instanceof Date)) {
        continue; // Пропускаем undefined и уже обработанный объект Date
      }

      updatedCookie += `; ${propName}`;
      if (propValue !== true) {
        updatedCookie += `=${propValue}`;
      }
    }
  }

  document.cookie = updatedCookie;
}

export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function deleteCookie(name: string): void {
  setCookie(name, '', { expires: -1 });
}
