"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
//import FTSODashboard from "./FTSODashboard"
import NetworkOverview from "./NetworkOverview"
import RpcTester from "./RpcTester"
//import { FTSODashboard } from "./ftso-dashboard"
//import { FTSODashboard } from "./ftso-dashboard"
//import { RPCTester } from "./rpc-tester"
//import { CodeSnippets } from "./code-snippets"

export function TabsNavigation() {
  return (
    <section className="container mx-auto px-4 pt-2 pb-12 bg-[#ffe4e8]">
      <Tabs defaultValue="network" className="w-full bg-transparent shadow-none">
        <div className="mb-8 overflow-x-auto">
          <TabsList className="inline-flex w-full min-w-max md:w-full gap-6 bg-transparent md:max-w-2xl md:mx-auto md:grid md:grid-cols-4">
            <TabsTrigger value="network" className="whitespace-nowrap">
              Network Overview
            </TabsTrigger>
            <TabsTrigger value="ftso" className="whitespace-nowrap">
              FTSO Data
            </TabsTrigger>
            <TabsTrigger value="rpc" className="whitespace-nowrap">
              RPC Tester
            </TabsTrigger>
            <TabsTrigger value="snippets" className="whitespace-nowrap">
              Code Snippets
            </TabsTrigger>
          </TabsList>
        </div>
        
        
        <TabsContent value="network">
          <NetworkOverview />
        </TabsContent>

        <TabsContent value="ftso">
          Coming Soon
        </TabsContent>

        <TabsContent value="rpc">
        <RpcTester/>
        </TabsContent>

        <TabsContent value="rpc">
       Coming soon      
         </TabsContent>


        

       


       
      </Tabs>
    </section>
  )
}
