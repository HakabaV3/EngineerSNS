<link rel="import" href="./ButtonView.html">

<template name="AuthView" controller="AuthViewController">
    <div class="AuthView">
        <div class="AuthView-headerMsg">
            Sign In
            <p class="AuthView-errorMsg">
                ユーザー名またはパスワードが違います。
            </p>
        </div>
        <form>
            <p>
                <label class="AuthView-labelUserName">
                    <span>User Name</span>
                    <input type="text" class="AuthView-userName">
                </label>
            </p>
            <p>
                <label class="AuthView-labelPassword">
                    <span>Password</span>
                    <input type="password" class="AuthView-password">
                </label>
            </p>
            <p>
                <ButtonView block class="AuthView-submit" type="submit">Sign In</ButtonView>
            </p>
        </form>
    </div>
</template>