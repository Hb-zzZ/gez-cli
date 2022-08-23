import { logError, logSuccess, logWarring } from '@/utils/log'
import { getTpl, ITpl } from '@/config/tpl'
import prompts from 'prompts'

const commonInstructions: string = `

↑/↓: 选择
←/→/[空格]: 切换选择
a: 全选
回车: 确认

`

// 获取所有模版对应地址
export const getTplList = async (list: string[] = []): Promise<ITpl[] | undefined> => {
  try {
    return Promise.all(list.map((name) => getTpl(name)))
  } catch (error) {
    logError(error)
  }
}

// 选择模板初始化或更新下载
export const selectTpl = async () => {
  try {
    const onSubmit = (prompt: {}, answer: { tplName: [] }) => console.log(`Thanks I got ${getTplList(answer.tplName)}`)

    const response = await prompts(
      [
        {
          type: 'multiselect',
          name: 'tplName',
          message: '请选择要拉取的模版',
          choices: [
            { title: 'element PC端', value: 'pc' },
            { title: 'vant 移动端', value: 'mobile' },
            { title: 'uni-app 全端', value: 'uni-app' }
          ],
          instructions: commonInstructions
        }
      ],
      { onSubmit }
    )

    return response
  } catch (error) {
    logError(error)
  }
}
