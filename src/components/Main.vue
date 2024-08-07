<template>
    <div class="container">
        <div class="top">
            <div class="icon">
                <img src="D:/Learning/Creation/Probability/my-project/src/components/32.png" alt="">
            </div>
            <div class="search">
                <InputText class="searchA" v-model="value1" placeholder="搜索" />
                <Button class="searchB" icon="pi pi-search" severity="contrast"></Button>
            </div>
            <div class="user">
                <p>请点击此处<Button class="log" label="登录" severity="secondary"/>，以获得更好的用户体验</p>
            </div>
        </div>
        <div class="main">
            <div class="left">
                <div class="content">
                    <PanelMenu :model="items" multiple />
                </div>
                <div class="themes">
                    <i class="pi pi-sun" style="color: #8C9CB2; font-size: 1.3rem"></i>
                    <ToggleSwitch class="switch custom-toggle" v-model="checked" />
                </div>
            </div>
            <div class="right">
                <div class="display">
                    <Splitter style="height: 700px;" class="mb-8">
                        <SplitterPanel>
                            <Splitter style="height: 700px;" layout="vertical">
                                <SplitterPanel>
                                    <div class="result">
                                        <Panel header="图形化结果展示区">
                                            <p class="m-0">随便什么吧</p>
                                        </Panel>
                                    </div>
                                </SplitterPanel>
                                <SplitterPanel>
                                    <div class="input">
                                        <Panel header="输入区">
                                            <p class="m-0">随便什么吧</p>
                                        </Panel>
                                    </div>
                                </SplitterPanel>
                            </Splitter>
                        </SplitterPanel>
                        <SplitterPanel>
                            <div class="summary">
                                <Panel header="提示区">
                                    <p class="m-0">随便什么吧</p>
                                </Panel>
                            </div>
                        </SplitterPanel>
                    </Splitter>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import PanelMenu from 'primevue/panelmenu';
import Panel from 'primevue/panel';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import ToggleSwitch from 'primevue/toggleswitch';
import 'primeicons/primeicons.css'

export default {
    components: {
        InputGroup,
        InputGroupAddon,
        Button,
        InputText,
        PanelMenu,
        Panel,
        Splitter,
        SplitterPanel,
        ToggleSwitch
    },
    data() {
        return {
            value1: "",
            checked: true,
            items: [
                {
                    label: "目录",
                    items: [
                        {
                            label: "第一章",
                            items: [
                                { label: "Buffon投针" }
                            ]
                        },
                        {
                            label: "第二章",
                        },
                        {
                            label: "第三章",
                        },
                        {
                            label: "第四章",
                        },
                        {
                            label: "第五章",
                        },
                    ]
                },
                {
                    label: "聊天",
                    icon: 'pi pi-comment',
                },
                {
                    label: "设置",
                    icon: 'pi pi-cog',
                },
                {
                    label: "我的收藏",
                    icon: 'pi pi-star'
                },
            ],
        };
    },
};
</script>

<style>
.container {
    width: 100%;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.icon {
    flex: 1;
    margin-left: 15px;
}

.search {
    flex: 2;
    display: flex;
    justify-content: center;
}

.user {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    margin-right: 15px;
}

img {
    height: 60px;
    margin-top: 10px;
}

.searchA {
    width: 400px;
    margin-right: 20px;
}

.main {
    display: flex;
}

.left {
    flex: 1;
    border-right: 1px solid #ddd;
    padding: 10px;
}

.right {
    flex: 3;
    padding: 10px;
}

.themes {
    display: flex;
    align-items: center;
    margin-top: 15px;
    margin-left: 19px;
}

.switch {
    margin-left: 5px;
}

.result,
.input,
.summary {
    margin-bottom: 20px;
}
.log {
    margin-left: 5px;
    margin-right: 5px;
}
</style>
