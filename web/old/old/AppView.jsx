<link rel="import" href="./ToolBarView.html">
<link rel="import" href="./SwitchView.html">
<link rel="import" href="./AuthPageView.html">
<link rel="import" href="./ProjectPageView.html">
<link rel="import" href="./ProjectCreatePageView.html">
<link rel="import" href="./UserPageView.html">
<link rel="import" href="./ConfigPageView.html">

<template name="AppView" controller="AppViewController">
    <div fit layout vertical class="AppView">
        <ToolBarView class="AppView-toolBarView"></ToolBarView>

        <SwitchView flex class="AppView-switchView">
            <AuthPageView class="AppView-authPageView"></AuthPageView>
            <ProjectPageView class="AppView-projectPageView"></ProjectPageView>
            <ProjectCreatePageView class="AppView-projectCreatePageView"></ProjectCreatePageView>
            <UserPageView class="AppView-userPageView"></UserPageView>
            <ConfigPageView class="AppView-configPageView"></ConfigPageView>
        </SwitchView>
    </div>
</template>
