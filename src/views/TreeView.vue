<template>
  <div class="tree-view">
    <div class="tree">
      <div class="tree-wrap" style="height: 100%;">
        <div class="search-box">
          <span>搜索：</span>
          <input type="text" v-model="keyword" placeholder="请输入分析点" @keydown.enter="filter" />
                    <el-button @click="getInitTreeData">刷新</el-button>
        </div>
        <vue3-tree-org
            ref="tree"
            :data="initTreeData"
            :horizontal="false"
            :collapsable="collapsable"
            :toolBar = "toolbar"
            :label-style="style"
            :node-draggable="false"
            :scalable="true"
            :only-one-node="false"
            :define-menus="defineMenus"
            :default-expand-level="level"
            :filter-node-method="filterNodeMethod"
            :clone-node-drag="cloneNodeDrag"
            :selected-key="focusNode"
            :selected-class-name="selectedClassName"
            :node-add="nodeAdd"
            :node-delete="nodeDelete"
            :node-edit="nodeEdit"
            @on-restore="restore"
            @on-contextmenu="onMenus"
            @on-node-click="onNodeClick"
            @on-node-focus="onNodeFocus"
            @on-node-blur="onNodeBlur"
        >
          <template v-slot="{node}">
            <div class="tree-org-node__text node-label">
              <div>
                <div class="custom-content">语义id:{{node.id}}</div>
                {{handleLabel(node.label)}}
              </div>

            </div>
          </template>
          <!-- 自定义展开按钮 -->
          <template v-slot:expand="{node}">
            <div>{{node.children.length}}</div>
          </template>
        </vue3-tree-org>
      </div>
    </div>
    <!--添加分析点对话框-->
    <el-dialog v-model="dialogFormVisible" title="增加文档分析点" align-center>
      <el-form :model="addNodeForm">
        <el-form-item label="分析点名" label-width="80px">
          <el-input v-model="addNodeForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="语义id" label-width="80px">
          <el-input v-model="addNodeForm.semanticsId" type="number" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addNodeClick">
          添加
        </el-button>
      </span>
      </template>
    </el-dialog>
    <!--删除分析点对话框-->
    <el-dialog
        v-model="centerDialogVisible"
        title="删除分析点"
        width="30%"
        align-center
    >
      <span>删除分析点将删除该分析点子树，确认要删除吗？</span>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteNodeClick">
          确认删除
        </el-button>
      </span>
      </template>
    </el-dialog>
    <!--编辑分析点对话框-->
    <el-dialog
        v-model="centerDialogVisible2"
        title="编辑分析点"
        width="30%"
        align-center
    >
      <el-form :model="editNodeForm">
        <el-form-item label="分析点名" label-width="80px">
          <el-input v-model="editNodeForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="语义id" label-width="80px">
          <el-input v-model="editNodeForm.semanticsId" type="number" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="centerDialogVisible2 = false">
          确认编辑
        </el-button>
      </span>
      </template>
    </el-dialog>
    <!--分析点内容-->
    <div class="detail">
      <div class="search">
        <el-input
            v-model="searchWord"
            class="w-50 m-2"
            placeholder="请输入检索词"
            :prefix-icon="Search"
        />
      </div>
      <div class="content-card">
        <el-scrollbar height="calc(100vh - 100px)">
          <el-col v-for="item in 20">
            <div class="card">
              <el-card shadow="hover">
                <div class="analysis">
                  <div class="analysis-content">
                    <p class="text">作业发布成功，学生端在“我的消息”及作业“可提交”栏中可以查看及提交相应作业。</p>
                  </div>
                  <div class="card-tag">
                    <el-tag class="ml-2">文本</el-tag>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="card">
              <el-card shadow="hover">
                <div class="analysis">
                  <div class="analysis-content" style="flex-direction: column">
                    <div class="table">
                      <el-table :data="tableData" style="width: 100%" height="200px">
                        <el-table-column prop="date" label="需求变更时间" />
                        <el-table-column prop="name" label="执行人" />
                        <el-table-column prop="address" label="具体变更内容" />
                      </el-table>
                      <p style="font-size: 13px;padding-top: 5px">表1.1 需求变更记录表</p>
                    </div>
                  </div>
                  <div class="card-tag">
                    <el-tag type=success class="ml-2">表格</el-tag>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="card">
              <el-card shadow="hover">
                <div class="analysis">
                  <div class="analysis-content" style="flex-direction: column">
                    <img src="https://p4.itc.cn/q_70/images03/20210628/a184db637b54449c8f40fa6266fd4044.png" class="img"/>
                    <p style="font-size: 13px;padding-top: 5px">图1.1 用例图</p>
                  </div>
                  <div class="card-tag">
                    <el-tag type="warning" class="ml-2">图片</el-tag>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="card">
              <el-card shadow="hover">
                <div class="analysis">
                  <div class="analysis-content" style="flex-direction: column">
                    <div class="code"></div>
                    <p style="font-size: 13px;padding-top: 5px">段1.1 RegisterClass</p>
                  </div>
                  <div class="card-tag">
                    <el-tag type="info" class="ml-2">代码</el-tag>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>

import {HttpClient} from "@/network/HttpClient";
import {ElMessage} from "element-plus";

export default {
  name: "searchTree",
  data() {
    return {
      // data: {
      //   "id":1,"label":"需求规格说明书",
      //   "pid": 0,
      //   "children":[
      //     {
      //       "id":2,"pid":1,"label":"产品研发部",
      //       "children":[
      //         {"id":6,"pid":2,"label":"业务用例","disabled":true},
      //         {"id":8,"pid":2,"label":"业务流程","noDragging":true},
      //         {"id":10,"pid":2,"label":"业务需求",}
      //       ]
      //     },
      //     {
      //       "id":3,"pid":1,"label":"客服部",
      //       "children":[
      //         {"id":11,"pid":3,"label":"客服一部"},
      //         {"id":12,"pid":3,"label":"客服二部"}
      //       ]
      //     },
      //     {"id":4,"pid":1,"label":"业务部"}
      //   ]
      // },
      toolbar:{
        scale: true,
        restore: true,
        expand: true,
        zoom: true,
        fullscreen: false
      },
      selectedValue: 1,
      keyword: '',
      horizontal: false,
      collapsable: true,
      onlyOneNode: true,
      cloneNodeDrag: true,
      expandAll: true,
      level:1,
      dialogFormVisible:false,
      centerDialogVisible2:false,
      centerDialogVisible:false,
      style: {
        background: "#fff",
        color: "#5e6d82",
      },
      focusNode:'',
      addNodeForm: {
        name: '',
        semanticsId: '',
      },
      editNodeForm:{
        name: '',
        semanticsId: '',
      },
      selectedClassName:'selectedNode',
      addId:'',
      deleteId:'',
      editId:'',
      searchWord:'',
      initData:{},
      initTreeData:{},
      tableData:[
        {
          date: '2016-05-03',
          name: '陈丽',
          address: '增加日志功能',
        },
        {
          date: '2016-05-02',
          name: '李华',
          address: '增加游客登录功能',
        },
        {
          date: '2016-05-02',
          name: '李华',
          address: '数据库回滚',
        },
        {
          date: '2016-05-02',
          name: '李华',
          address: '改变原型样式',
        },
        {
          date: '2016-05-02',
          name: '李华',
          address: '增加单点登录功能',
        },
      ]
    };
  },
  created() {
    this.getInitTreeData()
  },
  methods: {
    async addNodeClick() {
      this.dialogFormVisible = false
      console.log(this.addId)
      this.addNodeForm.semanticsPId = this.addId
      await HttpClient.post("addTreeLink", this.addNodeForm).then(res => {
        if(res.result == false){
          ElMessage({
            message: res.msg,
            type: 'error',
          })
        }else{
          ElMessage({
            message: res.msg,
            type: 'success',
          })
        }
        this.getInitTreeData()
      })
    },
    async deleteNodeClick() {
      this.centerDialogVisible = false
      console.log(this.deleteId)
      await HttpClient.post("delTreeLink", {semanticsId:this.deleteId}).then(res => {
        console.log(res)
        this.getInitTreeData()
      })
    },
    async getInitTreeData() {
      const res = await HttpClient.post("getKeywordTree", {})
      this.initTreeData = res.rows[0]
      console.log(this.initTreeData)
    },

    defineMenus(e, node) {
      if (node.disabled) {
        return [
          { name:'添加关联表格', command: 'addTable' },
          { name:'添加关联图片', command: 'addImg' },
          { name:'添加关联文本', command: 'addText' },
        ]
      } else {
        return [
          { name:'新建分析点', command: 'add' },
          { name:'编辑分析点', command: 'edit' },
          { name:'删除分析点', command: 'delete'},
          { name:'锁定分析点', command: 'lock' },
          { name:'添加关联表格', command: 'addTable' },
          { name:'添加关联图片', command: 'addImg' },
          { name:'添加关联文本', command: 'addText' },
        ]
      }
    },
    nodeAdd(){
      this.dialogFormVisible = true
    },
    nodeDelete(){
      this.centerDialogVisible = true
    },
    nodeEdit(){
      this.centerDialogVisible2 = true
    },
    onMenus({ node, command }) {
      console.log(node, command);
      switch(command){
        case 'add':
          this.addId = node.id
          break;
        case 'edit':
          this.editId = node.id
          break;
        case 'delete':
          this.deleteId = node.id
          break;
      }
    },
    restore() {
      console.log('restore')
    },
    filter(){
      // @ts-ignore
      this.$refs.tree.filter(this.keyword);
    },
    filterNodeMethod(value, data) {
      console.log(value, data)
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    onNodeClick(e, data) {
      // @ts-ignore
      this.focusNode = data.id;
    },
    onNodeFocus(e, data){
      // @ts-ignore
      this.focusNode = data;
    },
    onNodeBlur(e, data){
      console.log("blur");
    },
    handleLabel(str){
      if(str) {
        str = str.slice(1,str.length-1)
        const arr = str.split(",")
        // console.log(arr);
        return arr[0]
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.detail{
  background: #f1f0f0;
  display: flex;
  flex-direction: column;
  .search {
    padding:1px 2px;
  }
  .content-card {
    background: #ffffff;
    margin: 0 2px 2px 2px;
    flex-grow: 1;
  }
}
.card{
  margin: 3px 3px;
}
.analysis{
  display: flex;
  justify-content: space-between;
  .card-tag{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
  }
  .analysis-content{
    flex-grow: 1;
    display: flex;
    overflow-y: auto;
    .text{
      text-align: start;
      font-size: 14px;
      padding:2px;
    }
    .img{
      width: 100%;
    }
    .table{
      width: 100%;
    }
  }
}
@media(min-width: 768px) {
  .tree-view {
    height: 100%;
    display: flex;
    .tree {
      width: 60%;
      height: 100%;
    }
    .detail {
      width:40%;
      height: 100%;
    }
  }
}
@media(max-width: 768px) {
  .tree-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    .tree {
      height: 50%;
    }
    .detail {
      height: 50%;
    }
  }
}
.tree-wrap {
  position: relative;
  padding-top: 52px;
  .zm-tree-org{
    padding: 0;
  }
}
.search-box {
  padding: 8px 15px;
  position: absolute;
  top: 0;
  left: 0;
  input {
    width: 200px;
    height: 32px;
    border:1px solid #ddd;
    outline: none;
    border-radius: 5px;
    padding-left: 10px;
  }
}
.tree-org-node__text {
  text-align: left;
  font-size: 14px;
  .custom-content {
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid currentColor;
  }
}
</style>
<style>
.selectedNode{
  background: #108ffe !important;
  color:#fff !important;
}
.el-card__body{
  padding: 4px !important;
}
</style>
