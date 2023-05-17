---
title: Jedis 实例
date: 2021-12-11
category: Redis
tag:
 - Redis
---

**完成一个手机验证码功能**：

```java
/**
 * 发送验证码要求：
 * 1、输入手机号，点击发送后随机生成 6 位数字码，2 分钟有效
 * 2、输入验证码，点击验证，返回成功或者失败
 * 3、每个手机号每天只能输入 3 次（即发送三次验证码）
 */
public class VerifyCodeUtil {

    /**
     * jedis 实例
     */
    private static final Jedis jedis = new Jedis("ip地址", 6379);

    /**
     * 验证码相关 key 前缀
     */
    private static final String VERIFY_CODE_PREFIX = "verifycode:";

    /**
     * 发送验证码
     *
     * @param telephone 手机号
     */
    public static String sendVerifyCode(String telephone) {
        jedis.auth("*****");

        // 获取当天手机验证码的发送次数
        String count = jedis.get(VERIFY_CODE_PREFIX + telephone + ":count");
        if (Objects.isNull(count)) { // 首次发送验证码
            // 设置过期时间为 当前时间 到 第二天 的 00:00:00 时刻
            Duration duration = Duration.between(LocalDateTime.now(), LocalDate.now().plusDays(1).atTime(0, 0, 0));
            int expireTime = Long.valueOf(60 * duration.toMinutes()).intValue();
            jedis.setex(VERIFY_CODE_PREFIX + telephone + ":count", expireTime, "1");
        } else if (Integer.parseInt(count) >= 3) { // 当前手机号验证码发送次数超过 3 次
            return "同一天内验证码发送次数不得超过 3 次！";
        }

        // 生成随机 6 位验证码，设置过期时间 2 分钟
        String verifyCode = genRandomNumStr(6);
        jedis.setex(VERIFY_CODE_PREFIX + telephone + ":code", 2 * 60, verifyCode);
        // 发送验证码次数 + 1
        if (Objects.nonNull(count)) {
            jedis.incrBy(VERIFY_CODE_PREFIX + telephone + ":count", 1L);
        }
        jedis.close();
        return "您的验证码为：" + verifyCode + "，有效期：2 分钟！";
    }

    /**
     * 验证手机号和验证码
     *
     * @param telephone  手机号
     * @param verifyCode 验证码
     * @return
     */
    public static String checkVerifyCode(String telephone, String verifyCode) {
        jedis.auth("*****");

        String resultMsg;
        String code = jedis.get(VERIFY_CODE_PREFIX + telephone + ":code");
        if (Objects.equals(code, verifyCode)) {
            resultMsg = "成功！";
        } else {
            resultMsg = "失败！";
        }
        return resultMsg;
    }

    /**
     * 生成一个定长的随机数字组成的字符
     *
     * @param length 字符的长度
     * @return 定长的随机数字组成的字符
     */
    private static String genRandomNumStr(int length) {
        StringBuilder str = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            str.append(random.nextInt(10));
        }
        return str.toString();
    }
}
```

**测试发送验证码**：

```java
public class SendCodeTest {
    public static void main(String[] args) {
        String resultMsg = VerifyCodeUtil.sendVerifyCode("13311111111");
        System.out.println("resultMsg = " + resultMsg);
    }
}
```

![sendCode](http://img.hl1015.top/blog/sendCode.gif)

**测试验证码正确性**：

```java
public class CheckCodeTest {
    public static void main(String[] args) {
        String checkVerifyCode = VerifyCodeUtil.checkVerifyCode("13311111111", "123456");
        System.out.println("checkVerifyCode = " + checkVerifyCode);
    }
}s
```

![checkCode](http://img.hl1015.top/blog/checkCode.gif)