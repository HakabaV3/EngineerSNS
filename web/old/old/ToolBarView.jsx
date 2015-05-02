<link rel="import" href="./UserInlineView.html">
<link rel="import" href="./ContextMenuView.html">

<template name="ToolBarView" controller="ToolBarViewController">
    <div class="ToolBarView" layout horizontal center>
        <a href="#!/">
            <span class="ToolBarView-title">EngineerSNS</span>
        </a>
        <div class="ToolBarView-spacer" flex>

        </div>
        <UserInlineView class="ToolBarView-userInlineView"></UserInlineView>
        <ContextMenuView class="ToolBarView-contextMenuView">
            <a class="ToolBarView-linkCreateProject">プロジェクト作成</a>
            <a class="ToolBarView-linkConfig">設定</a>
            <a class="ToolBarView-linkSignOut">サインアウト</a>
        </ContextMenuView>
    </div>
</template>