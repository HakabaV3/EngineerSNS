<link rel="import" href="./UserInlineView.html">
<link rel="import" href="./CardView.html">

<template name="ConfigPageView" controller="ConfigPageViewController">
    <div class="ConfigPageView" fit layout vertical>
        <header>
            <p class="ConfigPageView-headerText">
                設定
            </p>
            <span class="util-largeOnly">
                <UserInlineView class="ConfigPageView-userInlineView"></UserInlineView>
                &nbsp;>>&nbsp;
            </span>
            設定
        </header>
        <div class="ConfigPageView-mainContainer" flex layout horizontal start>
            <CardView self-stretch flex>
                未実装だよ(´・ω・｀)
            </CardView>
        </div>
    </div>
</template>