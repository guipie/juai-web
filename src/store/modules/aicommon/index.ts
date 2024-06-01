
import { SetupStoreId } from '@/enum';
import { defineStore } from 'pinia';
import { getLocalState, setLocalState } from './shared';
import { deletePrompts, getChatModels, getExamplePrompts, getMyPrompts, getPrompts, postPrompt } from '@/service/api';
import { useChatStore } from '@/store/modules/chat';
import { sessionStg } from '@/utils/storage';
import { useAppStore } from '@/store/modules/app';
import { useRouterPush } from '@/hooks/common/router';
export const useAICommonStore = defineStore(SetupStoreId.AiCommon, {
  state: (): JuAI.AICommonState => getLocalState(),
  actions: {
    recordState() {
      setLocalState(this.$state);
      sessionStg.set('applications', this.applications);
      sessionStg.set('myApplications', this.myApplications);
    },
    async applicationInit() {
      await this.getApplications();
      await this.getMyApplications();
      useAppStore().handReloadFlag = false;
    },
    async getModels() {
      const models = sessionStg.get("models");
      if (models && models?.length > 0 && !useAppStore().handReloadFlag) {
        this.models = models;
        this.recordState();
      }
      else
        await getChatModels().then((res) => {
          if (res.data && res.data.length > 0) {
            this.models = res.data;
            sessionStg.set('models', this.models);
            this.recordState();
          }
        });
    },
    async getApplications() {
      const applications = sessionStg.get("applications");
      if (applications && applications?.length > 0 && !useAppStore().handReloadFlag) {
        this.applications = applications;
        this.recordState();
      }
      else
        await getPrompts().then(res => {
          if (res.data && res.data.length > 0) {
            this.applications = res.data;
            this.recordState()
          }
        }).catch(err => console.log(err))
    },
    async getMyApplications() {
      const myApplications = sessionStg.get("myApplications");
      if (myApplications && myApplications?.length > 0 && !useAppStore().handReloadFlag) {
        this.myApplications = myApplications;
        this.recordState();
      }
      else
        await getMyPrompts().then(res => {
          this.myApplications = res.data ?? [];
          this.recordState()
        }).catch(err => console.log(err))
    },
    postMyApplication(data: JuAI.ChatPrompt, avatar?: File | null) {
      return postPrompt(data, avatar).then(res => {
        if (res.data) {
          let index = this.myApplications.findIndex(m => m.id == res.data!.id);
          if (index > -1)
            this.myApplications.splice(index, 1, res.data!);
          else
            this.myApplications.unshift(res.data!);
        }
        this.recordState();
        return res;
      })
    },
    deleteMyApplication(id: number) {
      return deletePrompts([id]).then(res => {
        var delIndex = this.myApplications.findIndex(m => m.id == id);
        this.myApplications.splice(delIndex, 1);
        this.recordState();
      })
    },
    toUseApplication(item: JuAI.ChatPrompt) {
      useChatStore().active = item.id!;
      useChatStore().addHistory(
        {
          title: item.title,
          isEdit: false,
          uuid: item.id!,
          avatar: item.avatar,
          desc: item.prompt,
        },
        [],
        item
      );
      useRouterPush(false).routerPushByKey("chat", { query: { uuid: item.id!.toString() } });
    },
    getChatExamplePrompts() {
      if (this.examplePromptList?.length > 0) return;
      getExamplePrompts().then(res => {
        if (res.data && res.data.length > 0)
          this.examplePromptList = res.data;
        this.recordState()
      }).catch(err => console.log(err))
    },
  }
});
