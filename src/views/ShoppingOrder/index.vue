<template>
  <div class="home">
    <NavBar></NavBar>
    <Search></Search>
    <ContentBox>
      <div>
        <div style="display: flex; justify-content: left;">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="订单编号">
              <el-input v-model="formInline.orderNo" placeholder="订单编号"></el-input>
            </el-form-item>
            <el-form-item label="支付状态">
              <el-select v-model="formInline.payStatus" placeholder="支付状态">
                <el-option label="未支付" value="0"></el-option>
                <el-option label="支付成功" value="1"></el-option>
                <el-option label="支付失败" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <el-form-item label="订单编号">
                        <span>{{ props.row.orderNo }}</span>
                      </el-form-item>
                      <el-form-item label="实付金额">
                        <span>{{ props.row.payMoney }}</span>
                      </el-form-item>
                      <el-form-item label="订单状态">
                                                <span>{{
                                                    props.row.orderStatus === 0 ? '待付款'
                                                        : props.row.orderStatus === 1 ? '待发货'
                                                            : props.row.orderStatus === 2 ? '已发货'
                                                                : props.row.orderStatus === 3 ? '已完成'
                                                                    : props.row.orderStatus === 4 ? '已关闭'
                                                                        : '超时'
                                                  }}</span>
                      </el-form-item>
                      <el-form-item label="支付状态">
                                                <span>{{
                                                    props.row.payStatus === 0 ? '未支付'
                                                        : props.row.payStatus === 1 ? '支付成功' : '支付失败'
                                                  }}</span>
                      </el-form-item>
                      <el-form-item label="创建时间">
                        <span>{{ props.row.createdTime }}</span>
                      </el-form-item>
                      <el-form-item label="订单总金额">
                        <span>{{ props.row.totalMoney }}</span>
                      </el-form-item>
                      <el-form-item label="数量合计">
                        <span>{{ props.row.totalNum }}</span>
                      </el-form-item>

                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple-light">
                      <el-form-item label="支付方式">
                        <span>{{ props.row.payType === 0 ? '在线支付' : '货到付款' }}</span>
                      </el-form-item>
                      <el-form-item label="支付时间" v-if="props.row.payTime">
                        <span>{{ props.row.payTime }}</span>
                      </el-form-item>
                      <el-form-item label="收件人名称">
                        <span>{{ props.row.receiverName }}</span>
                      </el-form-item>
                      <el-form-item label="收件人电话">
                        <span>{{ props.row.receiverPhone }}</span>
                      </el-form-item>
                      <el-form-item label="收件人地址">
                        <span>{{ props.row.receiverAddress }}</span>
                      </el-form-item>
                      <el-form-item label="过期时间">
                        <span>{{ props.row.expirationTime }}</span>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="订单编号" prop="orderNo">
          </el-table-column>
          <el-table-column label="实付金额" prop="payMoney">
          </el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="props">
              {{
                props.row.orderStatus === 0 ? '待付款'
                    : props.row.orderStatus === 1 ? '待发货'
                        : props.row.orderStatus === 2 ? '已发货'
                            : props.row.orderStatus === 3 ? '已完成'
                                : props.row.orderStatus === 4 ? '已关闭'
                                    : props.row.orderStatus === 6 ? '退款成功'
                                        : '超时'
              }}
            </template>
          </el-table-column>
          <el-table-column label="支付状态">
            <template slot-scope="props">
              {{
                props.row.payStatus === 0 ? '未支付'
                    : props.row.payStatus === 1 ? '支付成功' : '支付失败'
              }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createdTime">
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button v-if="row.orderStatus ===0" type="primary" @click="onSearchProduct(row)" size="mini"
                         icon="el-icon-loading">
                待支付
              </el-button>
              <el-tag v-if="row.orderStatus ===5" type="danger" size="mini"><i class="el-icon-circle-close"/>已超时
              </el-tag>
              <el-tag v-if="[1,2,3,4].includes(row.orderStatus)" type="success" size="mini"><i
                  class="el-icon-circle-check"/>支付成功
              </el-tag>
              <el-tag v-if="row.orderStatus === 6" type="info" size="mini"><i
                  class="el-icon-circle-check"/>退款成功
              </el-tag>
              <el-button v-if="[1,2,3,4].includes(row.orderStatus)" @click="DialogVisible(row.orderNo)" type="primary"
                         size="mini" plain style="margin-left: 5px">退款
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination class="elp" :current-page="this.pageNo" :page-size="this.pageSize"
                       :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next" :total="total"
                       @size-change="handleSizeChange" @current-change="handleCurrentChange"/>

        <el-dialog title="退款原因" :visible.sync="dialogVisible" width="30%">
          <el-select v-model="value" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="ReFundsMoney()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </ContentBox>
    <Footer></Footer>
  </div>
</template>

<script>
// 全局组件
import NavBar from "@/components/NavBar";
import Search from "@/components/Search";
import Footer from "@/components/Footer";
import CheckBox from "@/components/CheckBox";
import {searchAllOrder, ReFunds} from '@/http/index'

export default {
  data() {
    return {
      formInline: {
          orderNo: '',
        payStatus: ''
      },
      tableData: [],
      pageNo: 1,
      pageSize: 5,
      total: 0,
      deadline5: Date.now() + 1000 * 60 * 60 * 8,
      dialogVisible: false,
      options: [{
        value: '1',
        label: '买错了'
      }, {
        value: '2',
        label: '商品有问题'
      }, {
        value: '3',
        label: '不想要了'
      }, {
        value: '4',
        label: '其他'
      }],
      value: ''
    }
  },
  created() {
    this.searchAllOrderList()
  },
  components: {
    NavBar,
    Footer,
    Search,
    CheckBox,
  },
  methods: {
    //查询
    async onSubmit() {
      this.searchAllOrderList()
    },
    //渲染当前用户所有订单
    async searchAllOrderList() {
      const res = await searchAllOrder({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        formInline: this.formInline
      });
      this.tableData = res.data.list
      this.total = res.data.total
    },
    //页面变化
    handleSizeChange(size) {
      this.pageSize = size
      this.searchAllOrderList()
    },
    handleCurrentChange(number) {
      this.pageNo = number
      this.searchAllOrderList()
    },
    //查看订单商品详情
    async onSearchProduct(row) {
      // console.log(row.orderNo);
      await this.$router.push("/payment/" + row.orderNo);
    },
    //开启弹窗
    DialogVisible(orderNo) {
      this.dialogVisible = true;
      this.formInline.orderNo = orderNo;
      // console.log('退款', orderNo)

    },
    //退款
    async ReFundsMoney() {
      const res = await ReFunds({orderNo: this.formInline.orderNo, reason: this.value})
      this.dialogVisible = false;
      if (res.code === "200") {
        this.$message({
          type: "info",
          message: "退款成功！"
        })
      } else if (res.code === "500") {
        this.$message({
          type: "error",
          message: "暂不支持支付宝退款！"
        })
      }
      this.searchAllOrderList()
    }

  }
}
</script>
<style>
.elp {
  margin-top: 10px;
  display: flex;
  justify-content: end;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
  