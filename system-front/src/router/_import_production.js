// product environment comnponent
module.exports = file => () => import('@/views/' + file + '.vue')