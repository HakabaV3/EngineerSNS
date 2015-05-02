<link rel="import" href="./UserInlineView.html">
<link rel="import" href="./CardView.html">

<template name="UserPageView" controller="UserPageViewController">
    <div class="UserPageView" fit layout vertical>
        <header>
            <p class="UserPageView-headerText">
                ユーザー
            </p>
            <UserInlineView class="UserPageView-userInlineView"></UserInlineView>
        </header>
        <div class="UserPageView-mainContainer" flex layout horizontal start>
            <!-- <CardView layout vertical class="UserPageView-sideMenu">
                <ul class="UserPageView-menu">
                    メニュー
                </ul>
            </CardView> -->

            <CardView self-stretch flex class="UserPageView-projectContainer">
            </CardView>
        </div>
    </div>
</template>