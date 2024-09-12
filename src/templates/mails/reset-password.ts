export const templateResetPassword = (url: string, email: string) => {
  return {
    from: process.env.MAIL,
    to: email,
    subject: '［売上管理システム］パスワード再設定のご案内',
    html: `
      <p> 売上管理システムからのお知らせ</p>
      <p>日頃より売上管理システムをご利用いただき、誠にありがとうございます。</p>
      <p> 下記のアドレス（URL）にアクセスし、パスワードの再設定を行ってください。</p>
      <p>ーーーーーーーーーーー</p>
      <p>【パスワードの再設定はこちら】</p>
      <p style="padding-left: 15px;"><a href="${url}">${url}</a></p>
      `,
  };
};
