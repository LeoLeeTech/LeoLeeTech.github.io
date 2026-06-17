type AvatarProps = {
  username: string;
};

/**
 * 社区没有上传头像功能，因此使用用户名的第一个字符作为头像。
 * 英文字母会自动变成大写，空用户名则显示问号。
 */
export function Avatar({ username }: AvatarProps) {
  return (
    <span className="avatar" aria-hidden="true">
      {username.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}
