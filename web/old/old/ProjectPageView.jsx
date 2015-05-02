<link rel="import" href="./UserInlineView.html">
<link rel="import" href="./ProjectInlineView.html">
<link rel="import" href="./CardView.html">

<template name="ProjectPageView" controller="ProjectPageViewController">
    <div class="ProjectPageView" fit layout vertical>
        <header>
            <p class="ProjectPageView-headerText">
                プロジェクト
            </p>
            <span class="util-largeOnly">
                <UserInlineView class="ProjectPageView-userInlineView"></UserInlineView>
                &nbsp;>>&nbsp;
            </span>
            <ProjectInlineView class="ProjectPageView-projectInlineView"></ProjectInlineView>
        </header>
        <div class="ProjectPageView-mainContainer" flex layout horizontal start>
            <CardView self-stretch style="width: 200px;">
                ファイルツリー
            </CardView>
            <CardView self-stretch flex>
                未実装だよ(´・ω・｀)
            </CardView>
        </div>
    </div>
</template>