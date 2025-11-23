const { createAdminClient } = require('./lib/supabase/server')

async function testAdminClient() {
    try {
        console.log('Testing Admin Client...')
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('product')
            .select('count')
            .single()

        if (error) {
            console.error('Error:', error)
        } else {
            console.log('Success! Data:', data)
        }
    } catch (error) {
        console.error('Exception:', error)
    }
}

testAdminClient()
